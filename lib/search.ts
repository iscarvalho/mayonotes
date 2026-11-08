import type { PGlite } from '@electric-sql/pglite';
import { chunkNote } from './chunk';
import { embed } from './embeddings';

export async function indexNote(db: PGlite, noteId: string, title: string, content: string) {
	const chunks = chunkNote(title, content);
	const vectors = chunks.length ? await embed(chunks, 'passage') : [];

	await db.transaction(async (tx) => {
		await tx.query('DELETE FROM chunks WHERE note_id = $1', [noteId]);
		for (let i = 0; i < chunks.length; i++) {
			await tx.query(
				'INSERT INTO chunks (note_id, text, embedding) VALUES ($1, $2, $3::vector)',
				[noteId, chunks[i], JSON.stringify(vectors[i])]
			);
		}
	});
}

export type SearchResult = {
	note_id: string;
	title: string;
	text: string;
	similarity: number; // 0 a 1, para exibir
	score: number;      // RRF, para ordenar
};

export async function searchNotes(db: PGlite, query: string, limit = 5) {
	const [vector] = await embed([query], 'query');
	const r = await db.query<SearchResult>(
		`WITH vec AS (
         SELECT id, row_number() OVER (ORDER BY embedding <=> $1::vector) AS rank
         FROM chunks
         ORDER BY embedding <=> $1::vector
         LIMIT 20
       ),
       fts AS (
         SELECT id, row_number() OVER (ORDER BY ts_rank(tsv, q) DESC) AS rank
         FROM chunks, websearch_to_tsquery('portuguese', $2) q
         WHERE tsv @@ q
         LIMIT 20
       )
       SELECT c.note_id, n.title, c.text,
         1 - (c.embedding <=> $1::vector) AS similarity,
         COALESCE(1.0 / (60 + vec.rank), 0) + COALESCE(1.0 / (60 + fts.rank), 0) AS score
       FROM chunks c
       JOIN notes n ON n.id = c.note_id
       LEFT JOIN vec ON vec.id = c.id
       LEFT JOIN fts ON fts.id = c.id
       WHERE vec.id IS NOT NULL OR fts.id IS NOT NULL
       ORDER BY score DESC
       LIMIT $3`,
		[JSON.stringify(vector), query, limit * 3]
	);

	const seen = new Set<string>();
	return r.rows.filter((row) => !seen.has(row.note_id) && seen.add(row.note_id)).slice(0, limit);
}