import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SEO } from '../../components/common/SEO';
import { RichTextContent } from '../../components/common/RichTextEditor';
import { schoolApi } from '../../services/api';
import { CalendarDays, Bell } from 'lucide-react';

type Announcement = { id:number; title:string; summary?:string; content:string; category?:string; published_at?:string };
export const Announcements: React.FC = () => {
  const [items,setItems]=useState<Announcement[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ schoolApi.getAnnouncements().then(setItems).catch(()=>setItems([])).finally(()=>setLoading(false)); },[]);
  return <div className="min-h-screen bg-stone-50">
    <SEO title="Pengumuman Sekolah" description="Informasi dan pengumuman resmi SMP Islam Caruy."/>
    <PageHeader title="Pengumuman" subtitle="Informasi resmi dari sekolah." breadcrumbs={[{label:'Beranda',href:'/'},{label:'Pengumuman'}]}/>
    <section className="mx-auto max-w-5xl space-y-4 px-4 py-12 sm:px-6">
      {loading ? <p className="py-12 text-center text-sm text-stone-500">Memuat pengumuman…</p> : items.length ? items.map(item=><article key={item.id} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-emerald-800"><Bell size={14}/><span>{item.category || 'Umum'}</span>{item.published_at && <><span>·</span><CalendarDays size={13}/><time>{new Date(item.published_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</time></>}</div>
        <h2 className="text-xl font-bold text-stone-900">{item.title}</h2>
        {item.summary && <p className="mt-2 text-sm text-stone-600">{item.summary}</p>}
        <RichTextContent value={item.content} className="mt-4 text-sm leading-7 text-stone-700"/>
      </article>) : <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-sm text-stone-500">Belum ada pengumuman yang diterbitkan.</div>}
    </section>
  </div>;
};
