import { toast } from '../../hooks/useToast';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { schoolApi } from '../../services/api';
import { SchoolProfile, SchoolVisionMission, SchoolHistory } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  Save,
  CheckCircle,
  Building,
  User,
  Compass,
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface ManageProfileProps {
  initialTab?: 'identitas' | 'sambutan' | 'visimisi' | 'sejarah';
}

export const ManageProfile: React.FC<ManageProfileProps> = ({ initialTab }) => {
  const location = useLocation();
  const { updateCachedProfile } = useSchool();

  // Determine active tab from prop or route path
  const getTabFromPath = (): 'identitas' | 'sambutan' | 'visimisi' | 'sejarah' => {
    if (initialTab) return initialTab;
    if (location.pathname.includes('/sejarah')) return 'sejarah';
    if (location.pathname.includes('/visi-misi')) return 'visimisi';
    return 'identitas';
  };

  const [activeTab, setActiveTab] = useState<'identitas' | 'sambutan' | 'visimisi' | 'sejarah'>(getTabFromPath());
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [visionMission, setVisionMission] = useState<SchoolVisionMission | null>(null);
  const [history, setHistory] = useState<SchoolHistory | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, initialTab]);

  useEffect(() => {
    Promise.all([
      schoolApi.getProfile(),
      schoolApi.getVisionMission(),
      schoolApi.getHistory()
    ]).then(([pRes, vRes, hRes]) => {
      setProfile(pRes);
      setVisionMission(vRes);
      setHistory(hRes);
    });
  }, []);


  const handleFileUpload = async (file: File, target: 'headmaster' | 'history') => {
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        if (target === 'headmaster' && profile) {
          setProfile({ ...profile, headmaster_photo: res.fileUrl });
        } else if (target === 'history' && history) {
          setHistory({ ...history, featured_image: res.fileUrl });
        }
        toast.success('Foto berhasil diunggah!');
      }
    } catch (err) {
      toast.error('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateProfile(profile);
      if (res.success) {
        updateCachedProfile(res.data);
        toast.success('Profil dan identitas sekolah berhasil disimpan!');
      }
    } catch (err) {
      toast.error('Gagal menyimpan profil sekolah.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVisionMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionMission) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateVisionMission(visionMission);
      if (res.success) {
        toast.success('Visi, Misi, Tujuan & Nilai Utama berhasil diperbarui!');
      }
    } catch (err) {
      toast.error('Gagal menyimpan Visi & Misi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!history) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateHistory(history);
      if (res.success) {
        toast.success('Konten sejarah sekolah & linimasa berhasil disimpan!');
      }
    } catch (err) {
      toast.error('Gagal menyimpan sejarah sekolah.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-poppins pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Profil Sekolah & Kurikulum</h1>
          <p className="text-xs text-stone-500 font-normal mt-0.5">
            Kelola data identitas resmi, sambutan kepala sekolah, rumusan visi misi, serta linimasa sejarah SMP Islam Caruy.
          </p>
        </div>
      </div>

      

      {/* TABS HEADER */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('identitas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'identitas'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>1. Identitas & Pokok Sekolah</span>
        </button>

        <button
          onClick={() => setActiveTab('sejarah')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sejarah'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Sejarah & Linimasa Pendirian</span>
        </button>

        <button
          onClick={() => setActiveTab('visimisi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'visimisi'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3. Visi, Misi & Nilai Utama</span>
        </button>

        <button
          onClick={() => setActiveTab('sambutan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sambutan'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>4. Sambutan Kepala Sekolah</span>
        </button>
      </div>

      {/* TAB 1: IDENTITAS SEKOLAH */}
      {activeTab === 'identitas' && profile && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Identitas & Informasi Pokok Pendidikan</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Informasi resmi yang tercantum di header, footer, dan halaman profil</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Sekolah</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input
                type="text"
                value={profile.npsn}
                onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Jenjang Pendidikan</label>
              <input
                type="text"
                value={profile.education_level}
                onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Status Sekolah</label>
              <input
                type="text"
                value={profile.status}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Akreditasi</label>
              <input
                type="text"
                value={profile.accreditation}
                onChange={(e) => setProfile({ ...profile, accreditation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tahun Berdiri</label>
              <input
                type="text"
                value={profile.founding_year}
                onChange={(e) => setProfile({ ...profile, founding_year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Telepon</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nomor WhatsApp</label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Email Sekolah</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Alamat Lengkap Sekolah</label>
            <textarea
              rows={2}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Deskripsi Ringkas Sekolah</label>
            <textarea
              rows={4}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Google Maps Embed URL</label>
            <input
              type="text"
              value={profile.maps_embed_url}
              onChange={(e) => setProfile({ ...profile, maps_embed_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-mono text-[11px]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Identitas Profil'}</span>
          </button>
        </form>
      )}

      {/* TAB 2: SEJARAH & LINIMASA */}
      {activeTab === 'sejarah' && history && (
        <form onSubmit={handleSaveHistory} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Sejarah & Linimasa Pendirian Sekolah</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Kelola artikel sejarah lengkap dan milestone perjalanan sekolah dari masa ke masa</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Judul Artikel Sejarah</label>
            <input
              type="text"
              value={history.title}
              onChange={(e) => setHistory({ ...history, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">Foto Utama Dokumentasi Sejarah</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={history.featured_image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400'}
                alt="Sejarah"
                className="w-32 h-20 rounded-xl object-cover border border-stone-200 shadow-xs"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={history.featured_image || ''}
                  onChange={(e) => setHistory({ ...history, featured_image: e.target.value })}
                  placeholder="URL Foto Sejarah"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <label className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Unggah File Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'history')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Uraian Artikel Sejarah</label>
            <textarea
              rows={8}
              value={history.content}
              onChange={(e) => setHistory({ ...history, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal leading-relaxed"
            />
          </div>

          {/* CRUD LINIMASA (MILESTONES) */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Linimasa Tonggak Sejarah (Milestones)</h3>
                <p className="text-[11px] text-stone-400">Tahun-tahun penting dan pencapaian bersejarah sekolah</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = history.milestones || [];
                  setHistory({
                    ...history,
                    milestones: [...current, { year: `${new Date().getFullYear()}`, title: '', desc: '' }]
                  });
                }}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {(history.milestones || []).map((ms, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="Tahun (e.g. 2005)"
                      value={ms.year}
                      onChange={(e) => {
                        const newMs = [...(history.milestones || [])];
                        newMs[idx] = { ...newMs[idx], year: e.target.value };
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="w-24 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-emerald-800 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Judul Peristiwa Penting"
                      value={ms.title}
                      onChange={(e) => {
                        const newMs = [...(history.milestones || [])];
                        newMs[idx] = { ...newMs[idx], title: e.target.value };
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMs = (history.milestones || []).filter((_, i) => i !== idx);
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Hapus Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat peristiwa..."
                    value={ms.desc}
                    onChange={(e) => {
                      const newMs = [...(history.milestones || [])];
                      newMs[idx] = { ...newMs[idx], desc: e.target.value };
                      setHistory({ ...history, milestones: newMs });
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-normal text-stone-600 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Sejarah & Linimasa'}</span>
          </button>
        </form>
      )}

      {/* TAB 3: VISI, MISI & NILAI UTAMA */}
      {activeTab === 'visimisi' && visionMission && (
        <form onSubmit={handleSaveVisionMission} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Visi, Misi, Tujuan & Nilai Utama</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Rumusan arah haluan pembinaan karakter peserta didik SMP Islam Caruy</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Rumusan Visi Sekolah</label>
            <textarea
              rows={3}
              value={visionMission.vision}
              onChange={(e) => setVisionMission({ ...visionMission, vision: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Motto Singkat Visi</label>
            <input
              type="text"
              value={visionMission.vision_motto}
              onChange={(e) => setVisionMission({ ...visionMission, vision_motto: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          {/* CRUD DAFTAR MISI */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-800">Daftar Misi Sekolah</label>
                <p className="text-[11px] text-stone-400">Langkah strategis perwujudan visi</p>
              </div>
              <button
                type="button"
                onClick={() => setVisionMission({ ...visionMission, missions: [...visionMission.missions, ''] })}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>

            {visionMission.missions.map((m, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => {
                    const newM = [...visionMission.missions];
                    newM[idx] = e.target.value;
                    setVisionMission({ ...visionMission, missions: newM });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newM = visionMission.missions.filter((_, i) => i !== idx);
                    setVisionMission({ ...visionMission, missions: newM });
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* CRUD DAFTAR TUJUAN SEKOLAH */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-800">Tujuan Satuan Pendidikan</label>
                <p className="text-[11px] text-stone-400">Target capaian lulusan dan kultur sekolah</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const curGoals = visionMission.goals || [];
                  setVisionMission({ ...visionMission, goals: [...curGoals, ''] });
                }}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tujuan</span>
              </button>
            </div>

            {(visionMission.goals || []).map((goal, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => {
                    const newGoals = [...(visionMission.goals || [])];
                    newGoals[idx] = e.target.value;
                    setVisionMission({ ...visionMission, goals: newGoals });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newGoals = (visionMission.goals || []).filter((_, i) => i !== idx);
                    setVisionMission({ ...visionMission, goals: newGoals });
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Visi & Misi'}</span>
          </button>
        </form>
      )}

      {/* TAB 4: SAMBUTAN KEPALA SEKOLAH */}
      {activeTab === 'sambutan' && profile && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Sambutan & Profil Kepala Sekolah</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Sambutan pimpinan yang ditampilkan di halaman beranda dan profil</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Lengkap & Gelar Pimpinan</label>
              <input
                type="text"
                value={profile.headmaster_name}
                onChange={(e) => setProfile({ ...profile, headmaster_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">URL / File Foto Kepala Sekolah</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.headmaster_photo}
                  onChange={(e) => setProfile({ ...profile, headmaster_photo: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'headmaster')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Teks Lengkap Sambutan Kepala Sekolah</label>
            <textarea
              rows={8}
              value={profile.headmaster_welcome}
              onChange={(e) => setProfile({ ...profile, headmaster_welcome: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Sambutan Kepala Sekolah'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
