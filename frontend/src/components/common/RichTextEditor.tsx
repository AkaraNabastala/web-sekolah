import React, { useRef } from 'react';

type EditorProps = {
  value?: string | null;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

type FormatAction = { label: string; before: string; after?: string; linePrefix?: string };

export const RichTextEditor: React.FC<EditorProps> = ({ value, onChange, rows = 6, placeholder }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const safeValue = value ?? '';

  const insert = (action: FormatAction) => {
    const element = ref.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = safeValue.slice(start, end);

    if (action.linePrefix) {
      const lineStart = safeValue.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
      const lineEndIndex = safeValue.indexOf('\n', end);
      const lineEnd = lineEndIndex === -1 ? safeValue.length : lineEndIndex;
      const block = safeValue.slice(lineStart, lineEnd);
      const formatted = block.split('\n').map(line => line ? action.linePrefix + line : line).join('\n');
      const next = safeValue.slice(0, lineStart) + formatted + safeValue.slice(lineEnd);
      onChange(next);
      requestAnimationFrame(() => {
        element.focus();
        element.setSelectionRange(lineStart, lineStart + formatted.length);
      });
      return;
    }

    const text = selected || 'teks';
    const before = action.before;
    const after = action.after || '';
    const next = safeValue.slice(0, start) + before + text + after + safeValue.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      const cursor = start + before.length + text.length + after.length;
      element.setSelectionRange(cursor, cursor);
    });
  };

  const actions: FormatAction[] = [
    { label: 'Tebal', before: '**', after: '**' },
    { label: 'Miring', before: '*', after: '*' },
    { label: 'Judul', before: '## ' },
    { label: 'Poin', before: '', linePrefix: '- ' },
    { label: 'Nomor', before: '', linePrefix: '1. ' },
    { label: 'Kutipan', before: '', linePrefix: '> ' },
    { label: 'Tautan', before: '[teks tautan](', after: ')' }
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white focus-within:border-emerald-500">
      <div className="flex flex-wrap gap-1 border-b border-stone-100 bg-stone-50 p-2" aria-label="Pemformatan teks">
        {actions.map(action => (
          <button
            key={action.label}
            type="button"
            onClick={() => insert(action)}
            aria-label={`Sisipkan format ${action.label.toLowerCase()}`}
            className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
          >
            {action.label}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        rows={rows}
        value={safeValue}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y border-0 px-3.5 py-3 text-sm leading-6 outline-none focus:ring-0"
      />
      <div className="border-t border-stone-100 bg-stone-50 px-3.5 py-2 text-[11px] text-stone-500">
        Pilih teks lalu gunakan tombol format. Tautan harus diawali http:// atau https://.
      </div>
    </div>
  );
};

const inlineContent = (value: string): React.ReactNode[] => {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  return value.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-stone-100 px-1 py-0.5">{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">{link[1]}</a>;
    }
    return part;
  });
};

const isSpecialLine = (line: string) =>
  /^(#{1,3} |[-*] |\d+\. |> )/.test(line);

export const RichTextContent: React.FC<{ value?: string | null; className?: string }> = ({ value, className = '' }) => {
  const lines = String(value || '').replace(/\r/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3}) (.*)$/);
    if (heading) {
      const level = heading[1].length;
      const content = inlineContent(heading[2]);
      const key = `heading-${index}`;
      if (level === 1) blocks.push(<h2 key={key} className="mb-3 mt-5 text-2xl font-bold">{content}</h2>);
      else if (level === 2) blocks.push(<h3 key={key} className="mb-2 mt-5 text-xl font-bold">{content}</h3>);
      else blocks.push(<h4 key={key} className="mb-2 mt-4 text-lg font-semibold">{content}</h4>);
      index += 1;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*] /.test(lines[index])) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`} className="mb-3 list-disc space-y-1 pl-6">
          {items.map((item, itemIndex) => <li key={itemIndex}>{inlineContent(item)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\. /.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\. /, ''));
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${index}`} className="mb-3 list-decimal space-y-1 pl-6">
          {items.map((item, itemIndex) => <li key={itemIndex}>{inlineContent(item)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) {
        quote.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`} className="my-4 border-l-4 border-emerald-200 pl-4 italic text-stone-600">
          {quote.map((item, itemIndex) => <p key={itemIndex}>{inlineContent(item)}</p>)}
        </blockquote>
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isSpecialLine(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={`p-${index}`} className="mb-3 leading-7">{inlineContent(paragraph.join(' '))}</p>);
  }

  return <div className={className}>{blocks}</div>;
};
