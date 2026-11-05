import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { Achievement } from '../../types';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, X, Trophy } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManageAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<Partial<Achievement>>({
    title: '',
    student_or_team: '',
    level: 'Kabupaten',
    category: 'Akademik',
    rank: 'Juara 1',
    year: '2025',
    organizer: '',
    photo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=600',
    description: ''
  });

  const loadData = async () => {
    try {
      const res = await schoolApi.getAchievements();
      setAchievements(res);
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
      title: '',
      student_or_team: '',
      level: 'Kabupaten',
      category: 'Akademik',
      rank: 'Juara 1',
      year: '2025',
      organizer: '',
      photo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=600',
      description: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingId(item.id);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await schoolApi.updateAchievement(editingId, form);
        toast.success('Prestasi berhasil diperbarui!');
      } else {
        await schoolApi.createAchievement(form);
        toast.success('Prestasi baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus catatan prestasi ini?')) {
      try {
        await schoolApi.deleteAchievement(id);
        toast.success('Prestasi berhasil dihapus.');
        loadData();
      } catch (err) {
        toast.error('Gagal menghapus prestasi.');
      }
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Prestasi Sekolah</h1>
          <p className="text-xs text-stone-500 font-normal mt-0.5">
            Dokumentasikan piagam, piala kejuaraan, dan capaian membanggakan para santri.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi</span>
        </button>
      </div>

      

      {/* TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Nama Kejuaraan / Prestasi</th>
                <th className="py-3 px-4">Peringkat & Tahun</th>
                <th className="py-3 px-4">Peraih (Siswa / Tim)</th>
                <th className="py-3 px-4">Tingkat & Penyelenggara</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {achievements.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900">{item.title}</p>
                    <span className="text-[10px] text-stone-400">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      {item.rank}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">Tahun {item.year}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{item.student_or_team}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-700">Tingkat {item.level}</p>
                    <p className="text-[10px] text-stone-400">{item.organizer}</p>
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
                {editingId ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Kejuaraan / Prestasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Juara 1 MTQ Pelajar Tingkat Kabupaten"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Nama Siswa / Tim *</label>
                  <input
                    type="text"
                    required
                    value={form.student_or_team}
                    onChange={(e) => setForm({ ...form, student_or_team: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Peringkat *</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Juara 1 / Medali Perak"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Tingkat</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Kategori</label>
                  <input
                    type="text"
                    placeholder="Akademik / Seni / dll."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Tahun</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Instansi Penyelenggara</label>
                <input
                  type="text"
                  placeholder="Misal: Kemenag / Disdikpora Cilacap"
                  value={form.organizer}
                  onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">URL Foto Dokumentasi</label>
                <input
                  type="text"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Keterangan Tambahan</label>
                <textarea
                  rows={2}
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
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
