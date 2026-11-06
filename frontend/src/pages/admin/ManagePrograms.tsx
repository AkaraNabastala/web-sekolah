import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { Plus, Edit, Trash2, Award, CheckCircle, AlertCircle, X, Search, Sparkles } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManagePrograms: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'unggulan',
    description: '',
    photo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800',
    schedule_info: '',
    instructor: '',
    display_order: 1,
    is_active: 1
  });

  const loadData = async () => {
    try {
      const data = await schoolApi.getAdminPrograms();
      setPrograms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: 'unggulan',
      description: '',
      photo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800',
      schedule_info: '',
      instructor: '',
      display_order: programs.length + 1,
      is_active: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category || 'unggulan',
      description: item.description || '',
      photo: item.photo || '',
      schedule_info: item.schedule_info || '',
      instructor: item.instructor || '',
      display_order: item.display_order || 1,
      is_active: item.is_active ?? 1
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setForm(prev => ({ ...prev, photo: res.fileUrl }));
        toast.success('Foto program berhasil diunggah!');
      }
    } catch {
      toast.error('Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Nama program wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await schoolApi.updateProgram(editingId, form);
        toast.success('Program berhasil diperbarui!');
      } else {
        await schoolApi.createProgram(form);
        toast.success('Program baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan program.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus program ini?')) return;
    try {
      await schoolApi.deleteProgram(id);
      toast.success('Program berhasil dihapus!');
      loadData();
    } catch {
      toast.error('Gagal menghapus program.');
    }
  };

  const filtered = programs.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Program & Ekstrakurikuler</h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Program</span>
        </button>
      </div>

      

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-stone-800"
        />
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400 text-xs">
            Belum ada program atau ekstrakurikuler terdaftar.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
                  <img
                    src={item.photo || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-emerald-800 backdrop-blur-sm uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-stone-900">{item.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed font-normal">
                    {item.description}
                  </p>
                  {item.schedule_info && (
                    <p className="text-[11px] text-emerald-700 font-medium pt-1">
                      🗓️ {item.schedule_info}
                    </p>
                  )}
                  {item.instructor && (
                    <p className="text-[11px] text-stone-400">
                      Pembina: {item.instructor}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                  {item.is_active ? 'Aktif' : 'Non-Aktif'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Program"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingId ? 'Ubah Program / Ekstrakurikuler' : 'Tambah Program Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nama Program *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="unggulan">Program Unggulan</option>
                    <option value="ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="keagamaan">Keagamaan & Adab</option>
                    <option value="akademik">Akademik & Sains</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Instruktur / Pembina</label>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Jadwal & Waktu Pelaksanaan</label>
                <input
                  type="text"
                  value={form.schedule_info}
                  onChange={(e) => setForm({ ...form, schedule_info: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Foto Program</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.photo}
                    onChange={(e) => setForm({ ...form, photo: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 transition-colors">
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Deskripsi Program</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-60"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
