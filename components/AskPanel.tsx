'use client';

import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { SearchResult } from '@/lib/search';
import { streamAnswer } from '@/lib/llm';
import { useApiKey } from '@/hooks/useApiKey';

type Props = {
  search: (q: string) => Promise<SearchResult[]>;
  onOpenNote: (id: string) => void;
};

export default function AskPanel({ search, onOpenNote }: Props) {
  const { apiKey, setApiKey } = useApiKey();
  const [keyInput, setKeyInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'searching' | 'answering'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !apiKey) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnswer('');
    setErrorMsg('');

    try {
      setStatus('searching');
      const found = await search(question);
      setSources(found);

      if (found.length === 0) {
        setAnswer('Não encontrei nada nas suas notas sobre isso.');
        return;
      }

      setStatus('answering');
      await streamAnswer({
        apiKey,
        question,
        sources: found,
        signal: controller.signal,
        onText: (t) => setAnswer((a) => a + t),
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setErrorMsg((err as Error).message);
    } finally {
      setStatus('idle');
    }
  }

  if (!apiKey) {
    return (
      <div className="col-span-2 flex items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (keyInput.trim()) setApiKey(keyInput.trim());
          }}
          className="w-full max-w-md space-y-3"
        >
          <h2 className="font-semibold">Configure sua chave da Anthropic</h2>
          <p className="text-sm text-muted">
            A chave fica salva só neste navegador e é enviada direto para a API da Anthropic.
          </p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand"
          />
          <button className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-black hover:brightness-90">
            Salvar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex min-h-0 flex-col">
      <form onSubmit={ask} className="flex gap-2 border-b border-line p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pergunte algo sobre suas notas..."
          className="flex-1 rounded-md border border-line bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand"
        />
        <button
          disabled={status !== 'idle'}
          className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-black hover:brightness-90 disabled:opacity-50"
        >
          Perguntar
        </button>
      </form>

      <div className="flex-1 overflow-y-auto p-6">
        {status === 'searching' && <p className="text-sm text-muted">Buscando nas notas...</p>}
        {errorMsg && <p className="text-sm text-brand">{errorMsg}</p>}

        {answer && (
          <article className="prose dark:prose-invert max-w-none prose-strong:text-ink prose-code:text-code">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </article>
        )}

        {answer && sources.length > 0 && (
          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Fontes</p>
            {sources.map((s, i) => (
              <button
                key={s.note_id}
                onClick={() => onOpenNote(s.note_id)}
                className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-surface"
              >
                <span className="font-medium text-brand">[{i + 1}]</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-line px-4 py-2 text-xs text-muted">
        Chave salva só neste navegador ·{' '}
        <button onClick={() => setApiKey(null)} className="underline hover:text-brand">
          remover
        </button>
      </footer>
    </div>
  );
}