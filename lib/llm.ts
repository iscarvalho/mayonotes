import type { SearchResult } from './search';

export type Provider = 'deepseek' | 'anthropic';

export const PROVIDERS: Record<Provider, { label: string; model: string; placeholder: string; keyUrl: string }> = {
  deepseek: {
    label: 'DeepSeek',
    model: 'deepseek-chat',
    placeholder: 'sk-...',
    keyUrl: 'https://platform.deepseek.com/api_keys',
  },
  anthropic: {
    label: 'Anthropic',
    model: 'claude-haiku-5-5',
    placeholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com',
  },
};

const SYSTEM = `Você responde perguntas usando apenas as notas pessoais do usuário, fornecidas entre tags <nota>.
- Responda em português, de forma direta.
- Cite a origem de cada informação com o número da nota entre colchetes, como [1] ou [2].
- Se as notas não tiverem a resposta, diga que não encontrou isso nas notas. Não invente.`;

function buildPrompt(question: string, sources: SearchResult[]) {
  const context = sources
    .map((s, i) => `<nota id="${i + 1}">\n${s.text}\n</nota>`)
    .join('\n\n');
  return `${context}\n\nPergunta: ${question}`;
}

type StreamArgs = {
  provider: Provider;
  apiKey: string;
  question: string;
  sources: SearchResult[];
  onText: (text: string) => void;
  signal?: AbortSignal;
};

function request(provider: Provider, apiKey: string, prompt: string, signal?: AbortSignal) {
  const model = PROVIDERS[provider].model;

  if (provider === 'deepseek') {
    // API compatível com OpenAI (chat completions)
    return fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
      }),
    });
  }

  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      stream: true,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
}

type SseEvent = {
  type?: string;
  error?: { message?: string };
  delta?: { type?: string; text?: string };
  choices?: { delta?: { content?: string | null } }[];
};

// Extrai o texto de um evento SSE; cada provedor usa um formato diferente.
function textFromEvent(provider: Provider, event: SseEvent): string | undefined {
  if (provider === 'deepseek') {
    if (event.error) throw new Error(event.error.message ?? 'Erro na API');
    return event.choices?.[0]?.delta?.content ?? undefined;
  }
  if (event.type === 'error') throw new Error(event.error?.message ?? 'Erro na API');
  if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') return event.delta.text;
}

export async function streamAnswer({ provider, apiKey, question, sources, onText, signal }: StreamArgs) {
  const res = await request(provider, apiKey, buildPrompt(question, sources), signal);

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => '');
    throw new Error(`Erro ${res.status}: ${body.slice(0, 200)}`);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // a última linha pode estar incompleta

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      const text = textFromEvent(provider, JSON.parse(data));
      if (text) onText(text);
    }
  }
}
