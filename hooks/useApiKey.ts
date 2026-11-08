'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'notas:anthropic-key';

export function useApiKey() {
  const [apiKey, setState] = useState<string | null>(null);

  useEffect(() => {
    try { setState(localStorage.getItem(STORAGE_KEY)); } catch {}
  }, []);

  function setApiKey(key: string | null) {
    try {
      key ? localStorage.setItem(STORAGE_KEY, key) : localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(key);
  }

  return { apiKey, setApiKey };
}