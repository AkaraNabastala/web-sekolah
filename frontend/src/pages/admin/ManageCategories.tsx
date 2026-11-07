import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tags, Pencil } from 'lucide-react';
import { schoolApi } from '../../services/api';
import { toast } from '../../hooks/useToast';

type Scope = 'news' | 'program' | 'facility';
type Category = { id:number; name:string; slug:string; description?:string };
const scopes: {value:Scope;label:string}[]=[{value:'news',label:'Berita'},{value:'program',label:'Program'},{value:'facility',label:'Fasilitas'}];
export const ManageCategories:React.FC=()=>{
 const [scope,setScope]=useState<Scope>('news');
 const [items,setItems]=useState<Category[]>([]);
 const [name,setName]=useState('');
 const [description,setDescription]=useState('');
 const [editingId,setEditingId]=useState<number|null>(null);
 const [loading,setLoading]=useState(false);
 const load=async()=>{setLoading(true);try{setItems(await schoolApi.getContentCategories(scope));}catch{toast.error('Kategori gagal dimuat.');}finally{setLoading(false);}};
 useEffect(()=>{void load();},[scope]);
 const add=async(e:React.FormEvent)=>{e.preventDefault();if(!name.trim())return;try{if(editingId)await schoolApi.updateContentCategory(editingId,scope,{name:name.trim(),description});else await schoolApi.createContentCategory({scope,name:name.trim(),description});setName('');setDescription('');setEditingId(null);toast.success(editingId?'Kategori diperbarui.':'Kategori ditambahkan.');await load();}catch(error:any){toast.error(error?.response?.data?.message||'Kategori gagal disimpan.');}};
 const edit=(item:Category)=>{setEditingId(item.id);setName(item.name);setDescription(item.description||'');};
 const remove=async(id:number)=>{if(!window.confirm('Hapus kategori ini?'))return;try{await schoolApi.deleteContentCategory(id,scope);toast.success('Kategori dihapus.');await load();}catch(error:any){toast.error(error?.response?.data?.message||'Kategori tidak dapat dihapus.');}};
 return <div className="space-y-6">
  <h1 className="text-2xl font-bold text-stone-900">Kategori Konten</h1>
  <div className="flex flex-wrap gap-2">{scopes.map(item=><button key={item.value} onClick={()=>setScope(item.value)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${scope===item.value?'bg-emerald-700 text-white':'border border-stone-200 bg-white text-stone-600'}`}>{item.label}</button>)}</div>
  <form onSubmit={add} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-[1fr_1.5fr_auto]">
   <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nama kategori" className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm"/>
   <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Deskripsi (opsional)" className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm"/>
   <div className="flex gap-2">{editingId&&<button type="button" onClick={()=>{setEditingId(null);setName("");setDescription("");}} className="rounded-xl border px-3 py-2.5 text-sm">Batal</button>}<button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/>{editingId?"Simpan":"Tambah"}</button></div>
  </form>
  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
   {loading?<p className="p-8 text-center text-sm text-stone-500">Memuat kategori…</p>:items.length?items.map(item=><div key={item.id} className="flex items-center justify-between gap-3 border-b border-stone-100 p-4 last:border-0"><div><div className="font-semibold text-stone-900">{item.name}</div>{item.description&&<p className="mt-1 text-xs text-stone-500">{item.description}</p>}</div><div className="flex gap-1"><button onClick={()=>edit(item)} aria-label={`Edit kategori ${item.name}`} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"><Pencil size={16}/></button><button onClick={()=>void remove(item.id)} aria-label={`Hapus kategori ${item.name}`} className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button></div></div>):<div className="p-10 text-center text-sm text-stone-500"><Tags className="mx-auto mb-2" size={22}/>Belum ada kategori.</div>}
  </div>
 </div>;
};
