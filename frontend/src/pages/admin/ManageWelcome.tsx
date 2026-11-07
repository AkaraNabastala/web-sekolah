import React, { useEffect, useState } from 'react';
import { toast } from '../../hooks/useToast';
import { schoolApi } from '../../services/api';
import { SchoolProfile, SchoolVisionMission, SchoolHistory } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  Save, CheckCircle, Building, User, Compass, BookOpen, Plus, Trash2,
  AlertCircle, Upload, Calendar, Layers, Sparkles
} from 'lucide-react';

export const ManageWelcome: React.FC = () => {
  const { updateCachedProfile } = useSchool();
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { schoolApi.getProfile().then(setProfile).catch(() => toast.error('Gagal memuat data kepala sekolah.')); }, []);
  const handleFileUpload = async (file: File, _target?: 'headmaster' | 'history') => {
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success && profile) { setProfile({ ...profile, headmaster_photo: res.fileUrl }); toast.success('Foto berhasil diunggah!'); }
    } catch { toast.error('Gagal mengunggah foto.'); }
    finally { setUploading(false); }
  };
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try { const res = await schoolApi.updateProfile(profile); if (res.success) { updateCachedProfile(res.data); toast.success('Sambutan kepala sekolah berhasil disimpan!'); } }
    catch { toast.error('Gagal menyimpan sambutan kepala sekolah.'); }
    finally { setSaving(false); }
  };
  return (
    <div className="space-y-6 font-poppins pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Sambutan Kepala Sekolah</h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">Kelola nama pimpinan, foto, dan sambutan kepala sekolah.</p>
      </div>
      {profile && (<form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Sambutan & Profil Kepala Sekolah</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Sambutan pimpinan yang ditampilkan di halaman beranda dan profil</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Lengkap & Gelar Pimpinan</label>
              <input
                type="text"
                value={(profile.headmaster_name) ?? ''}
                onChange={(e) => setProfile({ ...profile, headmaster_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">URL / File Foto Kepala Sekolah</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={(profile.headmaster_photo) ?? ''}
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
              value={(profile.headmaster_welcome) ?? ''}
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
        </form>)}
    </div>
  );
};
