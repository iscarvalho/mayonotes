'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Note } from './useNotes';

export function useAutosave(
  note: Note | undefined,
  content: string,
  save: (id: string, content: string) => Promise<void>,
  delay = 500
) {
  const pending = useRef<{ id: string; content: string } | null>(null);

  // Salva `delay` ms depois da última alteração
  useEffect(() => {
    if (!note || content === note.content) {
      pending.current = null;
      return;
    }
    pending.current = { id: note.id, content };
    const t = setTimeout(() => {
      pending.current = null;
      save(note.id, content);
    }, delay);
    return () => clearTimeout(t);
  }, [note, content, save, delay]);

  // Salva imediatamente o que estiver pendente
  const flush = useCallback(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    save(p.id, p.content);
  }, [save]);

  // Descarta o pendente de uma nota (ex.: antes de apagá-la)
  const discard = useCallback((id: string) => {
    if (pending.current?.id === id) pending.current = null;
  }, []);

  // Salva ao mudar de aba ou minimizar o navegador
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [flush]);

  return { flush, discard };
}