import { toast } from '../../hooks/useToast';
import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { Teacher, Staff } from '../../types';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Users,
  GraduationCap
} from 'lucide-react';

export const ManageTeachers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form for teacher or staff
  const [teacherForm, setTeacherForm] = useState<Partial<Teacher>>({
    name: '',
    title: 'S.Pd',
    nip: '-',
    photo: '/demo/demo-person.svg',
    position: 'Guru Mata Pelajaran',
    subject: '',
    last_education: 'S1 Pendidikan',
    short_bio: '',
    display_order: 1
  });

  const [staffForm, setStaffForm] = useState<Partial<Staff>>({
    name: '',
    photo: '/demo/demo-person.svg',
    position: 'Staf Administrasi',
    department: 'Tata Usaha',
    last_education: 'S1 / D3',
    short_bio: '',
    display_order: 1
  });

  const loadData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        schoolApi.getTeachers(),
        schoolApi.getStaff()
      ]);
      setTeachers(tRes);
      setStaffList(sRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleOpenCreate = () => {
    setEditingId(null);
    if (activeTab === 'teachers') {
      setTeacherForm({
        name: '',
        title: 'S.Pd',
        nip: '-',
        photo: '/demo/demo-person.svg',
        position: 'Guru Mata Pelajaran',
        subject: '',
        last_education: 'S1 Pendidikan',
        short_bio: '',
        display_order: teachers.length + 1
      });
    } else {
      setStaffForm({
        name: '',
        photo: '/demo/demo-person.svg',
        position: 'Staf Administrasi',
        department: 'Tata Usaha',
        last_education: 'S1 / D3',
        short_bio: '',
        display_order: staffList.length + 1
      });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'teachers') {
      setTeacherForm({ ...item });
    } else {
      setStaffForm({ ...item });
    }
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        if (activeTab === 'teachers') {
          setTeacherForm(prev => ({ ...prev, photo: res.fileUrl }));
        } else {
          setStaffForm(prev => ({ ...prev, photo: res.fileUrl }));
        }
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
      if (activeTab === 'teachers') {
        if (editingId) {
          await schoolApi.updateTeacher(editingId, teacherForm);
          toast.success('Data guru berhasil diperbarui!');
        } else {
          await schoolApi.createTeacher(teacherForm);
          toast.success('Guru baru berhasil ditambahkan!');
        }
      } else {
        if (editingId) {
          await schoolApi.updateStaff(editingId, staffForm);
          toast.success('Data staf berhasil diperbarui!');
        } else {
          await schoolApi.createStaff(staffForm);
          toast.success('Staf baru berhasil ditambahkan!');
        }
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        if (activeTab === 'teachers') {
          await schoolApi.deleteTeacher(id);
        } else {
          await schoolApi.deleteStaff(id);
        }
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
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Guru & Tenaga Kependidikan</h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'teachers' ? 'Guru' : 'Staf'}</span>
        </button>
      </div>

      

      {/* Tabs Switcher */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200/80 flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'teachers' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Guru Pengajar ({teachers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'staff' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tenaga Kependidikan / Staf ({staffList.length})</span>
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Foto & Nama</th>
                <th className="py-3 px-4">{activeTab === 'teachers' ? 'Mata Pelajaran' : 'Divisi / Bagian'}</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Pendidikan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {(activeTab === 'teachers' ? teachers : staffList).map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img src={item.photo || ''} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        {item.nip && item.nip !== '-' && (
                          <p className="text-[10px] text-stone-400 font-mono">NIP: {item.nip}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">
                    {activeTab === 'teachers' ? item.subject : item.department}
                  </td>
                  <td className="py-3 px-4 text-stone-600">{item.position}</td>
                  <td className="py-3 px-4 text-stone-500">{item.last_education}</td>
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
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-stone-900">
                {editingId ? `Edit ${activeTab === 'teachers' ? 'Guru' : 'Staf'}` : `Tambah ${activeTab === 'teachers' ? 'Guru' : 'Staf'} Baru`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={(activeTab === 'teachers' ? teacherForm.name : staffForm.name) ?? ''}
                  onChange={(e) => {
                    if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, name: e.target.value });
                    else setStaffForm({ ...staffForm, name: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Jabatan *</label>
                  <input
                    type="text"
                    required
                    value={(activeTab === 'teachers' ? teacherForm.position : staffForm.position) ?? ''}
                    onChange={(e) => {
                      if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, position: e.target.value });
                      else setStaffForm({ ...staffForm, position: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {activeTab === 'teachers' ? 'Mata Pelajaran Diampu *' : 'Divisi / Departemen *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={(activeTab === 'teachers' ? teacherForm.subject : staffForm.department) ?? ''}
                    onChange={(e) => {
                      if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, subject: e.target.value });
                      else setStaffForm({ ...staffForm, department: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={(activeTab === 'teachers' ? teacherForm.last_education : staffForm.last_education) ?? ''}
                    onChange={(e) => {
                      if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, last_education: e.target.value });
                      else setStaffForm({ ...staffForm, last_education: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Urutan Tampilan</label>
                  <input
                    type="number"
                    value={(activeTab === 'teachers' ? teacherForm.display_order : staffForm.display_order) ?? ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 1;
                      if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, display_order: v });
                      else setStaffForm({ ...staffForm, display_order: v });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Foto Profil (URL atau Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={(activeTab === 'teachers' ? teacherForm.photo : staffForm.photo) ?? ''}
                    onChange={(e) => {
                      if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, photo: e.target.value });
                      else setStaffForm({ ...staffForm, photo: e.target.value });
                    }}
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
                <label className="text-xs font-bold text-stone-700">Deskripsi Singkat / Bio</label>
                <textarea
                  rows={2}
                  value={(activeTab === 'teachers' ? teacherForm.short_bio : staffForm.short_bio) ?? ''}
                  onChange={(e) => {
                    if (activeTab === 'teachers') setTeacherForm({ ...teacherForm, short_bio: e.target.value });
                    else setStaffForm({ ...staffForm, short_bio: e.target.value });
                  }}
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
