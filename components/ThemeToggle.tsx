'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-ink"
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}