'use client';

import { useEffect } from 'react';
import { preloadModel } from '@/lib/embeddings';
import { useModelStatus } from '@/hooks/useModelStatus';

export default function ModelStatusBar() {
  const { state, progress, error } = useModelStatus();

  useEffect(() => {
    preloadModel();
  }, []);

  if (state === 'ready' || state === 'idle') return null;

  if (state === 'error') {
    return (
      <div className="border-b border-line px-6 py-2 text-xs text-brand">
        Não foi possível carregar a busca inteligente: {error}
      </div>
    );
  }

  const percent = Math.round(progress * 100);

  return (
    <div className="border-b border-line">
      <div className="flex items-center justify-between px-6 py-1.5 text-xs text-muted">
        <span>Preparando a busca inteligente (só na primeira vez)</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div className="h-0.5 bg-surface">
        <div
          className="h-full bg-brand transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}