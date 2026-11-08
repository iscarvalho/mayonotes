import type { SearchResult } from '@/lib/search';

type Props = {
  results: SearchResult[];
  onOpen: (id: string) => void;
};

export default function SearchResults({ results, onOpen }: Props) {
  if (results.length === 0) {
    return <p className="px-3 py-2 text-sm text-muted">Nada encontrado.</p>;
  }

  return (
    <>
      {results.map((r) => (
        <div
          key={r.note_id}
          onClick={() => onOpen(r.note_id)}
          className="mb-1 cursor-pointer rounded-md px-3 py-2 transition hover:bg-surface"
        >
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate font-medium">{r.title}</span>
            <span className="shrink-0 text-xs text-muted">{Math.round(r.similarity * 100)}%</span>
          </div>
          <p className="line-clamp-2 text-xs text-muted">{r.text}</p>
        </div>
      ))}
    </>
  );
}