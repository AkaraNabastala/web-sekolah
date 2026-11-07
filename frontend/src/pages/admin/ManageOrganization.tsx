import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { OrganizationMember } from '../../types';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, X, Upload } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManageOrganization: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<Partial<OrganizationMember>>({
    position: '',
    name: '',
    nip: '-',
    photo: '/demo/demo-person.svg',
    level: 1,
    parent_id: null,
    display_order: 1,
    description: ''
  });

  const loadData = async () => {
    try {
      const res = await schoolApi.getOrganization();
      setMembers(res);
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
      position: '',
      name: '',
      nip: '-',
      photo: '/demo/demo-person.svg',
      level: 1,
      parent_id: null,
      display_order: members.length + 1,
      description: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: OrganizationMember) => {
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
        toast.success('Foto berhasil diunggah!');
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
        await schoolApi.updateOrgMember(editingId, form);
        toast.success('Anggota struktur berhasil diperbarui!');
      } else {
        await schoolApi.createOrgMember(form);
        toast.success('Anggota baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus pejabat dari bagan organisasi ini?')) {
      try {
        await schoolApi.deleteOrgMember(id);
        toast.success('Data berhasil dihapus.');
        loadData();
      } catch (err) {
        toast.error('Gagal menghapus data.');
      }
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Struktur Organisasi</h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Anggota</span>
        </button>
      </div>

      

      {/* TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Urutan & Posisi</th>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Atasan</th>
                <th className="py-3 px-4">Tugas / Deskripsi Singkat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {members.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img src={item.photo || ''} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800 text-xs">{item.position}</span>
                        <p className="text-[10px] text-stone-400">Order: {item.display_order}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900">{item.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">NIP: {item.nip || '-'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-stone-600 text-xs">{members.find(member => member.id === item.parent_id)?.position || 'Pimpinan tertinggi'}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{item.description || '-'}</td>
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
                {editingId ? 'Edit Anggota Struktur' : 'Tambah Anggota Struktur'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Jabatan Struktur *</label>
                <input
                  type="text"
                  required
                  value={(form.position) ?? ''}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Pejabat & Gelar *</label>
                <input
                  type="text"
                  required
                  value={(form.name) ?? ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">NIP (Opsional)</label>
                  <input type="text" value={(form.nip || '') ?? ''} onChange={(e) => setForm({ ...form, nip: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Atasan / Induk Jabatan</label>
                  <select value={(form.parent_id ?? '') ?? ''} onChange={(e) => setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : null })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50">
                    <option value="">Tidak memiliki atasan</option>
                    {members.filter(member => member.id !== editingId).map(member => <option key={member.id} value={(member.id) ?? ''}>{member.position} — {member.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Foto Anggota (URL atau Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={(form.photo) ?? ''}
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
                <label className="text-xs font-bold text-stone-700">Uraian Tugas / Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={(form.description) ?? ''}
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
