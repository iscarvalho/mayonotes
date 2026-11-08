// ---------- Estado do modelo (observável) ----------

export type ModelStatus = {
    state: 'idle' | 'loading' | 'ready' | 'error';
    progress: number; // 0 a 1
    error?: string;
  };
  
  let status: ModelStatus = { state: 'idle', progress: 0 };
  const listeners = new Set<() => void>();
  const files = new Map<string, { loaded: number; total: number }>();
  
  function setStatus(next: ModelStatus) {
    status = next;
    listeners.forEach((l) => l());
  }
  
  export function subscribeModelStatus(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  
  export function getModelStatus() {
    return status;
  }
  
  function handleProgress(p: { status: string; file?: string; loaded?: number; total?: number }) {
    if (p.status !== 'progress' || !p.file || !p.total) return;
    files.set(p.file, { loaded: p.loaded ?? 0, total: p.total });
  
    let loaded = 0;
    let total = 0;
    files.forEach((f) => { loaded += f.loaded; total += f.total; });
  
    if (status.state !== 'ready') {
      setStatus({ state: 'loading', progress: total ? loaded / total : 0 });
    }
  }
  
  // ---------- Worker ----------
  
  type Pending = { resolve: (v: number[][]) => void; reject: (e: Error) => void };
  
  let worker: Worker | null = null;
  let nextId = 0;
  const pending = new Map<number, Pending>();
  
  function getWorker() {
    if (!worker) {
      worker = new Worker(new URL('../workers/embed.worker.ts', import.meta.url), { type: 'module' });
  
      worker.onmessage = (e) => {
        const msg = e.data;
  
        if (msg.type === 'progress') return handleProgress(msg.progress);
        if (msg.type === 'ready') return setStatus({ state: 'ready', progress: 1 });
  
        if (msg.type === 'error' && msg.id === undefined) {
          return setStatus({ state: 'error', progress: 0, error: msg.message });
        }
  
        const p = pending.get(msg.id);
        if (!p) return;
        pending.delete(msg.id);
        msg.type === 'result' ? p.resolve(msg.embeddings) : p.reject(new Error(msg.message));
      };
  
      worker.onerror = (e) => {
        setStatus({ state: 'error', progress: 0, error: e.message || 'Falha ao iniciar o worker' });
      };
    }
    return worker;
  }
  
  export function preloadModel() {
    if (status.state !== 'idle') return;
    setStatus({ state: 'loading', progress: 0 });
    getWorker().postMessage({ type: 'load' });
  }
  
  export function embed(texts: string[], kind: 'query' | 'passage'): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      getWorker().postMessage({ id, texts, kind });
    });
  }