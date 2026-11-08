'use client';

import { useEffect, useState } from 'react';
import type { SearchResult } from '@/lib/search';

export function useNoteSearch(search: (q: string) => Promise<SearchResult[]>, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      search(query).then(setResults).catch(console.error);
    }, delay);
    return () => clearTimeout(t);
  }, [query, search, delay]);

  return { query, setQuery, results, clear: () => setQuery('') };
}