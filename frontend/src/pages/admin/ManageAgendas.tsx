import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, CheckCircle, AlertCircle, X, Search } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { RichTextEditor } from '../../components/common/RichTextEditor';

export const ManageAgendas: React.FC = () => {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '11:30',
    location: 'Kampus SMP Islam Caruy',
    organizer: 'Panitia Sekolah',
    is_published: 1
  });

  const loadData = async () => {
    try {
      const data = await schoolApi.getAdminAgendas();
      setAgendas(data);
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
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      end_time: '11:30',
      location: 'Kampus SMP Islam Caruy',
      organizer: 'Panitia Sekolah',
      is_published: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || '',
      event_date: item.event_date ? String(item.event_date).split('T')[0] : '',
      start_time: item.start_time || '08:00',
      end_time: item.end_time || 'Selesai',
      location: item.location || 'Kampus SMP Islam Caruy',
      organizer: item.organizer || 'Panitia Sekolah',
      is_published: item.is_published ?? 1
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.event_date) {
      toast.error('Judul dan tanggal kegiatan wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await schoolApi.updateAgenda(editingId, form);
        toast.success('Agenda berhasil diperbarui!');
      } else {
        await schoolApi.createAgenda(form);
        toast.success('Agenda baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan agenda.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) return;
    try {
      await schoolApi.deleteAgenda(id);
      toast.success('Agenda berhasil dihapus!');
      loadData();
    } catch {
      toast.error('Gagal menghapus agenda.');
    }
  };

  const filtered = agendas.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Agenda Kegiatan</h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agenda</span>
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

      {/* Table / List */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-100">
              <tr>
                <th className="py-4 px-6">Tanggal & Waktu</th>
                <th className="py-4 px-6">Kegiatan</th>
                <th className="py-4 px-6">Lokasi</th>
                <th className="py-4 px-6">Penyelenggara</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Belum ada agenda kegiatan yang terdaftar.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{item.start_time} - {item.end_time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900">{item.title}</p>
                      {item.description && (
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-stone-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.location}</span>
                    </td>
                    <td className="py-4 px-6 text-stone-600">{item.organizer}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Agenda"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingId ? 'Ubah Agenda' : 'Tambah Agenda'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nama / Judul Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Tanggal Acara *</label>
                  <input
                    type="date"
                    required
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Jam Mulai</label>
                  <input
                    type="text"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Jam Selesai</label>
                  <input
                    type="text"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Penyelenggara</label>
                  <input
                    type="text"
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Keterangan Tambahan</label>
                <RichTextEditor rows={5} value={form.description || ''} onChange={description => setForm({ ...form, description })}/>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published === 1}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="is_published" className="text-xs text-stone-700 font-medium">
                  Terbitkan agenda ini ke website publik
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
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
                  {loading ? 'Menyimpan...' : 'Simpan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
