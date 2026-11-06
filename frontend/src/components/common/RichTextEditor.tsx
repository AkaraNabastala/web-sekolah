import React, { useRef } from 'react';

type EditorProps = { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string };
export const RichTextEditor: React.FC<EditorProps> = ({ value, onChange, rows = 6, placeholder }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = '') => {
    const element = ref.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = value.slice(start, end) || 'teks';
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      const cursor = start + before.length + selected.length + after.length;
      element.setSelectionRange(cursor, cursor);
    });
  };
  const actions = [
    { label: 'Tebal', before: '**', after: '**' },
    { label: 'Miring', before: '*', after: '*' },
    { label: 'Judul', before: '## ', after: '' },
    { label: 'Poin', before: '- ', after: '' },
    { label: 'Nomor', before: '1. ', after: '' },
    { label: 'Tautan', before: '[teks tautan](', after: ')' }
  ];
  return <div className="overflow-hidden rounded-xl border border-stone-200 bg-white focus-within:border-emerald-500">
    <div className="flex flex-wrap gap-1 border-b border-stone-100 bg-stone-50 p-2" aria-label="Pemformatan teks">
      {actions.map(action => <button key={action.label} type="button" onClick={() => insert(action.before, action.after)} className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800">{action.label}</button>)}
    </div>
    <textarea ref={ref} rows={rows} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="w-full resize-y border-0 px-3.5 py-3 text-sm leading-6 outline-none focus:ring-0"/>
    <div className="border-t border-stone-100 px-3 py-2 text-[11px] text-stone-400">Gunakan toolbar untuk format tebal, miring, judul, daftar, dan tautan.</div>
  </div>;
};

const inlineContent = (value: string): React.ReactNode[] => {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  return value.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-stone-100 px-1 py-0.5">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">{link[1]}</a>;
    return part;
  });
};

export const RichTextContent: React.FC<{ value?: string | null; className?: string }> = ({ value, className = '' }) => {
  const lines = String(value || '').replace(/\r/g, '').split('\n');
  return <div className={className}>
    {lines.map((line, index) => {
      if (!line.trim()) return <div key={index} className="h-3"/>;
      if (line.startsWith('### ')) return <h3 key={index} className="mb-2 mt-4 text-lg font-semibold">{inlineContent(line.slice(4))}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="mb-2 mt-5 text-xl font-bold">{inlineContent(line.slice(3))}</h2>;
      if (line.startsWith('# ')) return <h2 key={index} className="mb-3 mt-5 text-2xl font-bold">{inlineContent(line.slice(2))}</h2>;
      if (/^[-*] /.test(line)) return <div key={index} className="flex gap-2 py-0.5"><span aria-hidden="true">•</span><span>{inlineContent(line.slice(2))}</span></div>;
      const numbered = line.match(/^\d+\. (.*)$/);
      if (numbered) return <div key={index} className="flex gap-2 py-0.5"><span className="font-semibold">{line.match(/^\d+/)?.[0]}.</span><span>{inlineContent(numbered[1])}</span></div>;
      return <p key={index} className="mb-2 leading-7">{inlineContent(line)}</p>;
    })}
  </div>;
};
