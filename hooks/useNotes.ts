'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDb } from './useDb';
import { indexNote, searchNotes } from '../lib/search';

export type Note = { id: string; title: string; content: string; updated_at: Date };

function extractTitle(content: string) {
  return content.split('\n')[0].replace(/^#+\s*/, '').trim() || 'Sem título';
}

export function useNotes() {
  const { db, loading, error } = useDb();
  const [notes, setNotes] = useState<Note[]>([]);
  const indexTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const refresh = useCallback(async () => {
    if (!db) return;
    const r = await db.query<Note>('SELECT * FROM notes ORDER BY updated_at DESC');
    setNotes(r.rows);
  }, [db]);

  useEffect(() => { refresh(); }, [refresh]);

  // NOVO: na primeira carga, indexa as notas que ainda não têm chunks
  useEffect(() => {
    if (!db) return;
    db.query<{ id: string; content: string }>(
      `SELECT id, content FROM notes n
       WHERE NOT EXISTS (SELECT 1 FROM chunks c WHERE c.note_id = n.id)`
    ).then((r) =>
      r.rows.forEach((n) =>
        indexNote(db, n.id, extractTitle(n.content), n.content).catch(console.error)
      )
    );
  }, [db]);

  // NOVO: agenda a indexação 2 s depois da última edição
  const scheduleIndex = useCallback((id: string, content: string) => {
    if (!db) return;
    clearTimeout(indexTimers.current.get(id));
    indexTimers.current.set(id, setTimeout(() => {
      indexNote(db, id, extractTitle(content), content).catch(console.error);
    }, 2000));
  }, [db]);

  const createNote = useCallback(async () => {
    const r = await db!.query<Note>(
      `INSERT INTO notes (title, content) VALUES ('Nova nota', '# Nova nota\n\n') RETURNING *`
    );
    await refresh();
    return r.rows[0];
  }, [db, refresh]);

  // ALTERADO: chama scheduleIndex e tem uma dependência a mais
  const updateNote = useCallback(async (id: string, content: string) => {
    await db!.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = now() WHERE id = $3',
      [extractTitle(content), content, id]
    );
    scheduleIndex(id, content);
    await refresh();
  }, [db, refresh, scheduleIndex]);

  const deleteNote = useCallback(async (id: string) => {
    clearTimeout(indexTimers.current.get(id)); // NOVO: cancela indexação pendente
    await db!.query('DELETE FROM notes WHERE id = $1', [id]);
    await refresh();
  }, [db, refresh]);

  // NOVO: busca semântica
  const search = useCallback((q: string) => searchNotes(db!, q), [db]);

  return { notes, loading, error, createNote, updateNote, deleteNote, search };
}