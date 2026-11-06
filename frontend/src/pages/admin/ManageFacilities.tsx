import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { Facility } from '../../types';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, X, Building, Upload } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManageFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<Partial<Facility>>({
    name: '',
    category: 'Ruang Belajar',
    description: '',
    photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800',
    capacity: '32 Siswa',
    condition_status: 'Sangat Baik',
    display_order: 1
  });

  const loadData = async () => {
    try {
      const res = await schoolApi.getFacilities();
      setFacilities(res);
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
      category: 'Ruang Belajar',
      description: '',
      photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800',
      capacity: '32 Siswa',
      condition_status: 'Sangat Baik',
      display_order: facilities.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Facility) => {
    setEditingId(item.id);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setForm(prev => ({ ...prev, photo: res.fileUrl }));
        toast.success('Foto fasilitas berhasil diunggah!');
      }
    } catch (err) {
      toast.error('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await schoolApi.updateFacility(editingId, form);
        toast.success('Fasilitas berhasil diperbarui!');
      } else {
        await schoolApi.createFacility(form);
        toast.success('Fasilitas baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Gagal menyimpan data fasilitas.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus fasilitas ini?')) {
      try {
        await schoolApi.deleteFacility(id);
        toast.success('Fasilitas berhasil dihapus.');
        loadData();
      } catch (err) {
        toast.error('Gagal menghapus fasilitas.');
      }
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Sarana & Fasilitas</h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Fasilitas</span>
        </button>
      </div>

      

      {/* TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Foto & Nama Fasilitas</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Kapasitas</th>
                <th className="py-3 px-4">Kondisi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {facilities.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{item.category}</td>
                  <td className="py-3 px-4 text-stone-600">{item.capacity || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[10px]">
                      {item.condition_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit Data"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Sarana / Ruangan *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="Ruang Belajar">Ruang Belajar</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Perpustakaan">Perpustakaan</option>
                    <option value="Fasilitas Ibadah">Fasilitas Ibadah</option>
                    <option value="Lapangan">Lapangan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Fasilitas Penunjang">Fasilitas Penunjang</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Kapasitas</label>
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Kondisi Fisik</label>
                <select
                  value={form.condition_status}
                  onChange={(e) => setForm({ ...form, condition_status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                >
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Perlu Perbaikan Ringan">Perlu Perbaikan Ringan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Foto Fasilitas (URL atau Upload) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.photo}
                    onChange={(e) => setForm({ ...form, photo: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                  <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Uraian / Spesifikasi</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
