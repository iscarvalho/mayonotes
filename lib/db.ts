import type { PGlite } from '@electric-sql/pglite';

const SCHEMA = `
  CREATE EXTENSION IF NOT EXISTS vector;
  CREATE TABLE IF NOT EXISTS notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL DEFAULT '',
    content text NOT NULL DEFAULT '',
    updated_at timestamptz DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS chunks (
    id serial PRIMARY KEY,
    note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
    text text NOT NULL,
    embedding vector(384)
  );
  ALTER TABLE chunks ADD COLUMN IF NOT EXISTS tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('portuguese', text)) STORED;
  CREATE INDEX IF NOT EXISTS chunks_tsv_idx ON chunks USING gin (tsv);
`;

let dbPromise: Promise<PGlite> | null = null;

export function getDb() {
    if (typeof window === 'undefined') {
        throw new Error('getDb só pode ser chamado no navegador');
    }
    if (!dbPromise) {
        dbPromise = (async () => {
            const { PGlite } = await import('@electric-sql/pglite');
            const { vector } = await import('@electric-sql/pglite-pgvector');
            const db = await PGlite.create('idb://notas', { extensions: { vector } });
            if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
                const ok = await navigator.storage.persist();
            }
            await db.exec(SCHEMA);
            return db;
        })();
    }
    return dbPromise;
}