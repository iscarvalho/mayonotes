const MAX_CHARS = 800;

export function chunkNote(title: string, content: string): string[] {
  const blocks = content
    .split(/\n(?=#{1,6}\s)|\n\s*\n/) // quebra em títulos e linhas em branco
    .map((b) => b.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';

  for (const block of blocks) {
    if (current && (current + '\n\n' + block).length > MAX_CHARS) {
      chunks.push(current);
      current = block;
    } else {
      current = current ? `${current}\n\n${block}` : block;
    }
  }
  if (current) chunks.push(current);

  // O título da nota vai junto em cada chunk para dar contexto
  return chunks.map((c) => `${title}\n\n${c}`);
}