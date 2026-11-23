'use client';

import { useEffect, useState } from 'react';
import type { Provider } from '@/lib/llm';

const STORAGE_KEY = 'notas:llm-key';
const LEGACY_KEY = 'notas:anthropic-key';

export type ApiKey = { provider: Provider; key: string };

function load(): ApiKey | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const legacy = localStorage.getItem(LEGACY_KEY);
  return legacy ? { provider: 'anthropic', key: legacy } : null;
}

export function useApiKey() {
  const [apiKey, setState] = useState<ApiKey | null>(null);

  useEffect(() => {
    try { setState(load()); } catch {}
  }, []);

  function setApiKey(value: ApiKey | null) {
    try {
      localStorage.removeItem(LEGACY_KEY);
      value ? localStorage.setItem(STORAGE_KEY, JSON.stringify(value)) : localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(value);
  }

  return { apiKey, setApiKey };
}
