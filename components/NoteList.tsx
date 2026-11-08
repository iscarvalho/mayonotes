import type { Note } from '@/hooks/useNotes';

type Props = {
  notes: Note[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NoteList({ notes, activeId, onSelect, onDelete }: Props) {
  if (notes.length === 0) {
    return <p className="px-3 py-2 text-sm text-muted">Nenhuma nota ainda.</p>;
  }

  return (
    <>
      {notes.map((n) => (
        <div
          key={n.id}
          onClick={() => onSelect(n.id)}
          className={`group mb-1 flex cursor-pointer items-center justify-between rounded-md border-l-2 px-3 py-2 text-sm transition ${
            n.id === activeId
              ? 'border-brand bg-surface'
              : 'border-transparent text-muted hover:bg-surface hover:text-ink'
          }`}
        >
          <span className="truncate">{n.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(n.id);
            }}
            className="invisible text-xs text-muted hover:text-brand group-hover:visible"
          >
            apagar
          </button>
        </div>
      ))}
    </>
  );
}