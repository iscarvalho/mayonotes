import type { Note } from '@/hooks/useNotes';
import type { SearchResult } from '@/lib/search';
import NoteList from './NoteList';
import SearchResults from './SearchResults';

type Props = {
  notes: Note[];
  activeId: string | null;
  query: string;
  results: SearchResult[] | null;
  onQueryChange: (q: string) => void;
  onSelect: (id: string) => void;
  onOpenResult: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({
  notes, activeId, query, results, onQueryChange, onSelect, onOpenResult, onDelete,
}: Props) {
  return (
    <aside className="overflow-y-auto border-r border-line p-3">
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar nas notas..."
        className="mb-3 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand"
      />
      {results ? (
        <SearchResults results={results} onOpen={onOpenResult} />
      ) : (
        <NoteList notes={notes} activeId={activeId} onSelect={onSelect} onDelete={onDelete} />
      )}
    </aside>
  );
}