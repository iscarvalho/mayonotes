'use client';

import { useEffect, useState } from 'react';
import type { PGlite } from '@electric-sql/pglite';
import { getDb } from '../lib/db';

export function useDb() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getDb().then(setDb).catch(setError);
  }, []);

  return { db, error, loading: !db && !error };
}