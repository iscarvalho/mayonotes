'use client';

import ThemeToggle from './ThemeToggle';

export type Mode = 'notes' | 'ask';

type Props = {
  mode: Mode;
  onToggleMode: () => void;
  onCreate: () => void;
};

export default function Header({ mode, onToggleMode, onCreate }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-3">
      <h1 className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        notas
      </h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMode}
          className={`rounded-md px-3 py-1.5 text-sm transition ${
            mode === 'ask' ? 'bg-surface text-ink' : 'text-muted hover:bg-surface hover:text-ink'
          }`}
        >
          Perguntar
        </button>
        <ThemeToggle />
        <button
          onClick={onCreate}
          className="rounded-md bg-action px-4 py-1.5 text-sm font-semibold text-black transition hover:brightness-90"
        >
          + Nova nota
        </button>
      </div>
    </header>
  );
}