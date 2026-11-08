'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '@/hooks/useNotes';
import ThemeToggle from '@/components/ThemeToggle';
import AskPanel from '@/components/AskPanel';
import ModelStatusBar from '@/components/ModelStatusBar';
import type { SearchResult } from '@/lib/search';

export default function NoteEditor() {
  const { notes, loading, error, createNote, updateNote, deleteNote, search } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [mode, setMode] = useState<'notes' | 'ask'>('notes');
  const pendingSave = useRef<{ id: string; content: string } | null>(null);

  const selected = notes.find((n) => n.id === selectedId);

  // Ao trocar de nota, carrega o conteúdo dela
  useEffect(() => {
    setContent(selected?.content ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Salva 500 ms depois da última tecla
  useEffect(() => {
    if (!selected || content === selected.content) {
      pendingSave.current = null;
      return;
    }
    pendingSave.current = { id: selected.id, content };
    const t = setTimeout(() => {
      pendingSave.current = null;
      updateNote(selected.id, content);
    }, 500);
    return () => clearTimeout(t);
  }, [content, selected, updateNote]);

  // Salva imediatamente o que estiver pendente
  const flushSave = useCallback(() => {
    const p = pendingSave.current;
    if (!p) return;
    pendingSave.current = null;
    updateNote(p.id, p.content);
  }, [updateNote]);

  // Salva ao mudar de aba ou minimizar o navegador
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [flushSave]);

  // Busca 300 ms depois da última tecla
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      search(query).then(setResults).catch(console.error);
    }, 300);
    return () => clearTimeout(t);
  }, [query, search]);

  function selectNote(id: string | null) {
    flushSave();
    setSelectedId(id);
  }

  async function handleCreate() {
    flushSave();
    const note = await createNote();
    setSelectedId(note.id);
    setMode('notes');
  }

  async function handleDelete(id: string) {
    if (pendingSave.current?.id === id) pendingSave.current = null;
    await deleteNote(id);
    if (id === selectedId) setSelectedId(null);
  }

  function openResult(id: string) {
    selectNote(id);
    setQuery('');
    setMode('notes');
  }

  function toggleMode() {
    flushSave();
    setMode((m) => (m === 'ask' ? 'notes' : 'ask'));
  }

  if (loading) return <p className="p-6 text-muted">Carregando...</p>;
  if (error) return <p className="p-6 text-brand">Erro: {error.message}</p>;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line px-6 py-3">
        <h1 className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          Mayonotes
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              mode === 'ask' ? 'bg-surface text-ink' : 'text-muted hover:bg-surface hover:text-ink'
            }`}
          >
            Perguntar
          </button>
          <ThemeToggle />
          <button
            onClick={handleCreate}
            className="rounded-md bg-action px-4 py-1.5 text-sm font-semibold text-black transition hover:brightness-90"
          >
            + Nova nota
          </button>
        </div>
      </header>

      <ModelStatusBar />

      <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr_1fr]">
        <aside className="overflow-y-auto border-r border-line p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nas notas..."
            className="mb-3 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand"
          />

          {results ? (
            results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">Nada encontrado.</p>
            ) : (
              results.map((r) => (
                <div
                  key={r.note_id}
                  onClick={() => openResult(r.note_id)}
                  className="mb-1 cursor-pointer rounded-md px-3 py-2 transition hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{r.title}</span>
                    <span className="shrink-0 text-xs text-muted">
                      {Math.round(r.similarity * 100)}%
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted">{r.text}</p>
                </div>
              ))
            )
          ) : (
            <>
              {notes.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted">Nenhuma nota ainda.</p>
              )}
              {notes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    selectNote(n.id);
                    setMode('notes');
                  }}
                  className={`group mb-1 flex cursor-pointer items-center justify-between rounded-md border-l-2 px-3 py-2 text-sm transition ${
                    n.id === selectedId && mode === 'notes'
                      ? 'border-brand bg-surface'
                      : 'border-transparent text-muted hover:bg-surface hover:text-ink'
                  }`}
                >
                  <span className="truncate">{n.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                    className="invisible text-xs text-muted hover:text-brand group-hover:visible"
                  >
                    apagar
                  </button>
                </div>
              ))}
            </>
          )}
        </aside>

        {mode === 'ask' ? (
          <AskPanel search={search} onOpenNote={openResult} />
        ) : selected ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              placeholder="Escreva em Markdown..."
              className="resize-none border-r border-line bg-transparent p-6 font-mono text-sm leading-relaxed text-ink outline-none placeholder:text-muted"
            />
            <article className="prose dark:prose-invert max-w-none overflow-y-auto p-6 prose-headings:text-ink prose-h1:text-brand prose-a:text-brand prose-strong:text-ink prose-code:text-code prose-li:marker:text-brand">
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          </>
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center gap-3 text-muted">
            <p>Selecione uma nota ou crie uma nova.</p>
            <button
              onClick={handleCreate}
              className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-black transition hover:brightness-90"
            >
              + Nova nota
            </button>
          </div>
        )}
      </div>
    </div>
  );
}