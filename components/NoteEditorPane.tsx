import ReactMarkdown from 'react-markdown';

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function NoteEditorPane({ content, onChange }: Props) {
  return (
    <>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="Escreva em Markdown..."
        className="resize-none border-r border-line bg-transparent p-6 font-mono text-sm leading-relaxed text-ink outline-none placeholder:text-muted"
      />
      <article className="prose dark:prose-invert max-w-none overflow-y-auto p-6 prose-headings:text-ink prose-h1:text-brand prose-a:text-brand prose-strong:text-ink prose-code:text-code prose-li:marker:text-brand">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </>
  );
}