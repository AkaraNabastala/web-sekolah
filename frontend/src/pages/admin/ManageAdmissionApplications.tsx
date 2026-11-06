import React, { useEffect, useState } from 'react';
import { Search, FileText, ExternalLink, Save, Download } from 'lucide-react';
import { ADMISSION_LABEL } from '../../config/admissions';
import { schoolApi } from '../../services/api';
import { toast } from '../../hooks/useToast';

type Application = {
 id:number; application_code:string; candidate_name:string; origin_school:string;
 parent_name:string; parent_phone:string; program:string; status:string; submitted_at:string;
 documents?: Record<string,string> | string; admin_notes?:string; address?:string; notes?:string;
};
const statusLabel:Record<string,string>={received:'Diterima',verified:'Terverifikasi',accepted:'Diterima sebagai siswa',rejected:'Tidak diterima'};
const parseDocuments=(value:Application['documents']):Record<string,string>=>{if(!value)return {};if(typeof value!=='string')return value;try{return JSON.parse(value) as Record<string,string>;}catch{return {};}};
export const ManageAdmissionApplications:React.FC=()=>{
 const [items,setItems]=useState<Application[]>([]);
 const [search,setSearch]=useState('');
 const [selected,setSelected]=useState<Application|null>(null);
 const [saving,setSaving]=useState(false);
 const load=async()=>{try{setItems(await schoolApi.getAdmissionApplications());}catch{toast.error('Data pendaftar gagal dimuat.');}};
 useEffect(()=>{void load();},[]);
 const save=async()=>{if(!selected)return;setSaving(true);try{await schoolApi.updateAdmissionApplication(selected.id,{status:selected.status,admin_notes:selected.admin_notes||''});toast.success('Status pendaftaran diperbarui.');setSelected(null);await load();}catch{toast.error('Perubahan gagal disimpan.');}finally{setSaving(false);}};
 const filtered=items.filter(x=>[x.candidate_name,x.application_code,x.parent_name].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
 const exportCsv=()=>{
  const fields=['application_code','candidate_name','origin_school','parent_name','parent_phone','program','status','submitted_at'];
  const quote=(value:unknown)=>{let raw=String(value??'');if(/^[=+\\-@]/.test(raw))raw="'"+raw;const q=String.fromCharCode(34);return q+raw.split(q).join(q+q)+q;};
  const csv=[fields.join(','),...filtered.map(item=>fields.map(field=>quote((item as any)[field])).join(','))].join(String.fromCharCode(13,10));
  const blob=new Blob([String.fromCharCode(0xFEFF)+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='data-pendaftar.csv';link.click();URL.revokeObjectURL(url);
 };
 return <div className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-stone-900">Pendaftar {ADMISSION_LABEL}</h1><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700"><Download size={15}/>Ekspor CSV</button><span className="text-sm text-stone-500">{items.length} pendaftar</span></div>
  <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5"><Search size={16} className="text-stone-400"/><input className="w-full text-sm outline-none" placeholder="Cari nama atau nomor pendaftaran" value={search} onChange={e=>setSearch(e.target.value)}/></div>
  <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-4">Nomor / Calon Siswa</th><th className="p-4">Asal Sekolah</th><th className="p-4">Orang Tua</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead><tbody className="divide-y">{filtered.map(x=><tr key={x.id}><td className="p-4"><div className="font-semibold">{x.candidate_name}</div><div className="text-xs text-stone-500">{x.application_code}</div></td><td className="p-4">{x.origin_school}</td><td className="p-4"><div>{x.parent_name}</div><div className="text-xs text-stone-500">{x.parent_phone}</div></td><td className="p-4">{statusLabel[x.status]||x.status}</td><td className="p-4"><button onClick={()=>setSelected({...x})} className="rounded-lg border px-3 py-2 text-xs font-semibold">Periksa</button></td></tr>)}</tbody></table>{!filtered.length&&<div className="p-10 text-center text-sm text-stone-500">Belum ada data pendaftaran.</div>}</div>
  {selected&&<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4"><div className="my-6 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6"><div className="flex justify-between"><h2 className="text-lg font-bold">Pemeriksaan {selected.application_code}</h2><button onClick={()=>setSelected(null)}>Tutup</button></div><div className="grid gap-3 text-sm sm:grid-cols-2"><p><b>Nama:</b> {selected.candidate_name}</p><p><b>Asal sekolah:</b> {selected.origin_school}</p><p><b>Orang tua:</b> {selected.parent_name}</p><p><b>Kontak:</b> {selected.parent_phone}</p><p><b>Program:</b> {selected.program}</p><p><b>Alamat:</b> {selected.address||'-'}</p></div><div><h3 className="mb-2 text-sm font-semibold">Dokumen</h3>{Object.entries(parseDocuments(selected.documents)).map(([name,url])=><a key={name} href={url} target="_blank" rel="noreferrer" className="mr-3 inline-flex items-center gap-1 text-sm text-emerald-700 underline"><FileText size={14}/>{name}<ExternalLink size={12}/></a>)}</div><label className="block text-sm font-semibold">Status<select className="mt-1 w-full rounded-lg border p-3 font-normal" value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}><option value="received">Diterima</option><option value="verified">Terverifikasi</option><option value="accepted">Diterima sebagai siswa</option><option value="rejected">Tidak diterima</option></select></label><label className="block text-sm font-semibold">Catatan admin<textarea rows={3} className="mt-1 w-full rounded-lg border p-3 font-normal" value={selected.admin_notes||''} onChange={e=>setSelected({...selected,admin_notes:e.target.value})}/></label><div className="flex justify-end"><button disabled={saving} onClick={()=>void save()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"><Save size={15}/>{saving?'Menyimpan…':'Simpan Pemeriksaan'}</button></div></div></div>}
 </div>;
};
