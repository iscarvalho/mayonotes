import type { SearchResult } from './search';

const MODEL = 'claude-haiku-5-5';

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
  apiKey: string;
  question: string;
  sources: SearchResult[];
  onText: (text: string) => void;
  signal?: AbortSignal;
};

export async function streamAnswer({ apiKey, question, sources, onText, signal }: StreamArgs) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      stream: true,
      system: SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(question, sources) }],
    }),
  });

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
      if (!line.startsWith('data: ')) continue;
      const event = JSON.parse(line.slice(6));
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        onText(event.delta.text);
      }
      if (event.type === 'error') throw new Error(event.error?.message ?? 'Erro na API');
    }
  }
}