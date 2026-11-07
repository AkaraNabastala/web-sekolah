import React from 'react';
import DOMPurify from 'dompurify';
import { Editor } from 'primereact/editor';

type EditorProps = {
  value?: string | null;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export const RichTextEditor: React.FC<EditorProps> = ({ value, onChange, rows = 6, placeholder }) => {
  const safeValue = value ?? '';
  const editorHeight = Math.max(5, rows) * 42;

  return (
    <div className="school-rich-editor overflow-hidden rounded-xl border border-stone-200 bg-white focus-within:border-emerald-500">
      <Editor
        value={safeValue}
        onTextChange={(event) => onChange(event.htmlValue ?? '')}
        placeholder={placeholder || 'Tulis konten di sini...'}
        style={{ height: `${editorHeight}px` }}
        className="w-full"
      />
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
  const content = String(value || '');
  const containsHtml = /<(p|h[1-6]|ul|ol|li|strong|em|a|blockquote|br|span|div)\\b/i.test(content);
  if (containsHtml) {
    const cleanHtml = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form']
    });
    return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  }
  const lines = content.replace(/\r/g, '').split('\n');
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
