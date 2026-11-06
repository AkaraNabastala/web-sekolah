import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Send, FileText } from 'lucide-react';
import { schoolApi } from '../../services/api';
import { toast } from '../../hooks/useToast';
import { RichTextEditor } from '../../components/common/RichTextEditor';

type Announcement = {
  id: number; title: string; slug: string; summary?: string; content: string;
  category?: string; cover_image?: string; status: 'draft' | 'published' | 'archived';
  published_at?: string;
};

type AnnouncementForm = { title: string; slug: string; summary: string; content: string; category: string; cover_image: string; status: 'draft' | 'published' | 'archived' };
const emptyForm: AnnouncementForm = { title: '', slug: '', summary: '', content: '', category: 'Umum', cover_image: '', status: 'draft' };

export const ManageAnnouncements: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setItems(await schoolApi.getAdminAnnouncements()); }
    catch { toast.error('Pengumuman gagal dimuat.'); }
  };
  useEffect(() => { void load(); }, []);

  const startCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const startEdit = (item: Announcement) => {
    setEditing(item.id);
    setForm({ title: item.title, slug: item.slug, summary: item.summary || '', content: item.content, category: item.category || 'Umum', cover_image: item.cover_image || '', status: item.status });
    setOpen(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Judul dan isi pengumuman wajib diisi.');
    setSaving(true);
    try {
      if (editing) await schoolApi.updateAnnouncement(editing, form);
      else await schoolApi.createAnnouncement(form);
      toast.success('Pengumuman berhasil disimpan.');
      setOpen(false); await load();
    } catch (error: any) { toast.error(error?.response?.data?.message || 'Pengumuman gagal disimpan.'); }
    finally { setSaving(false); }
  };
  const remove = async (id: number) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    try { await schoolApi.deleteAnnouncement(id); toast.success('Pengumuman dihapus.'); await load(); }
    catch { toast.error('Pengumuman gagal dihapus.'); }
  };
  const filtered = items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-stone-900">Pengumuman</h1>
      <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/> Buat Pengumuman</button>
    </div>
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5"><Search size={16} className="text-stone-400"/><input aria-label="Cari pengumuman" className="w-full text-sm outline-none" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pengumuman"/></div>
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {filtered.length ? filtered.map(item=><div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4 last:border-0">
        <div className="min-w-0"><div className="font-semibold text-stone-900">{item.title}</div><div className="mt-1 flex gap-2 text-xs text-stone-500"><span>{item.category || 'Umum'}</span><span>·</span><span>{item.status === 'published' ? 'Terbit' : item.status === 'draft' ? 'Draf' : 'Arsip'}</span></div></div>
        <div className="flex gap-2"><button onClick={()=>startEdit(item)} className="rounded-lg border p-2 text-stone-600 hover:bg-stone-50" aria-label="Edit"><Pencil size={16}/></button><button onClick={()=>void remove(item.id)} className="rounded-lg border p-2 text-red-600 hover:bg-red-50" aria-label="Hapus"><Trash2 size={16}/></button></div>
      </div>) : <div className="p-10 text-center text-sm text-stone-500"><FileText className="mx-auto mb-2" size={24}/>Belum ada pengumuman.</div>}
    </div>
    {open && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{editing ? 'Edit Pengumuman' : 'Pengumuman Baru'}</h2><button type="button" onClick={()=>setOpen(false)} className="text-stone-500">Tutup</button></div>
        <label className="block space-y-1 text-sm font-medium">Judul<input required className="w-full rounded-lg border p-3 font-normal" value={form.title} onChange={e=>setForm({...form,title:e.target.value,slug: editing ? form.slug : e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')})}/></label>
        <label className="block space-y-1 text-sm font-medium">Ringkasan<textarea rows={2} className="w-full rounded-lg border p-3 font-normal" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/></label>
        <label className="block space-y-1 text-sm font-medium">Isi Pengumuman<RichTextEditor rows={8} value={form.content} onChange={content=>setForm({...form,content})}/></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium">Kategori<input className="w-full rounded-lg border p-3 font-normal" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label>
          <label className="block space-y-1 text-sm font-medium">Status<select className="w-full rounded-lg border p-3 font-normal" value={form.status} onChange={e=>setForm({...form,status:e.target.value as typeof form.status})}><option value="draft">Simpan sebagai draf</option><option value="published">Terbitkan</option><option value="archived">Arsip</option></select></label>
        </div>
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-4 py-2 text-sm">Batal</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Send size={15}/>{saving?'Menyimpan…':'Simpan'}</button></div>
      </form>
    </div>}
  </div>;
};
