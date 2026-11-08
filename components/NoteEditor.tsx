'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useAutosave } from '@/hooks/useAutoSave';
import { useNoteSearch } from '@/hooks/useNoteSearch';
import Header, { type Mode } from './Header';
import ModelStatusBar from './ModelStatusBar';
import Sidebar from './Sidebar';
import NoteEditorPane from './NoteEditorPane';
import EmptyState from './EmptyState';
import AskPanel from './AskPanel';

export default function NoteEditor() {
  const { notes, loading, error, createNote, updateNote, deleteNote, search } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<Mode>('notes');

  const selected = notes.find((n) => n.id === selectedId);
  const { flush, discard } = useAutosave(selected, content, updateNote);
  const { query, setQuery, results, clear } = useNoteSearch(search);

  // Ao trocar de nota, carrega o conteúdo dela
  useEffect(() => {
    setContent(selected?.content ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function openNote(id: string) {
    flush();
    setSelectedId(id);
    setMode('notes');
  }

  function openResult(id: string) {
    openNote(id);
    clear();
  }

  async function handleCreate() {
    flush();
    const note = await createNote();
    setSelectedId(note.id);
    setMode('notes');
  }

  async function handleDelete(id: string) {
    discard(id);
    await deleteNote(id);
    if (id === selectedId) setSelectedId(null);
  }

  function toggleMode() {
    flush();
    setMode((m) => (m === 'ask' ? 'notes' : 'ask'));
  }

  if (loading) return <p className="p-6 text-muted">Carregando...</p>;
  if (error) return <p className="p-6 text-brand">Erro: {error.message}</p>;

  return (
    <div className="flex h-screen flex-col">
      <Header mode={mode} onToggleMode={toggleMode} onCreate={handleCreate} />
      <ModelStatusBar />

      <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr_1fr]">
        <Sidebar
          notes={notes}
          activeId={mode === 'notes' ? selectedId : null}
          query={query}
          results={results}
          onQueryChange={setQuery}
          onSelect={openNote}
          onOpenResult={openResult}
          onDelete={handleDelete}
        />

        {mode === 'ask' ? (
          <AskPanel search={search} onOpenNote={openResult} />
        ) : selected ? (
          <NoteEditorPane content={content} onChange={setContent} />
        ) : (
          <EmptyState onCreate={handleCreate} />
        )}
      </div>
    </div>
  );
}