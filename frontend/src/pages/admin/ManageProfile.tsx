import React, { useEffect, useState } from 'react';
import { toast } from '../../hooks/useToast';
import { schoolApi } from '../../services/api';
import { SchoolProfile, SchoolVisionMission, SchoolHistory } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  Save, CheckCircle, Building, User, Compass, BookOpen, Plus, Trash2,
  AlertCircle, Upload, Calendar, Layers, Sparkles
} from 'lucide-react';

export const ManageProfile: React.FC = () => {
  const { updateCachedProfile } = useSchool();
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { schoolApi.getProfile().then(setProfile).catch(() => toast.error('Gagal memuat profil sekolah.')); }, []);
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateProfile(profile);
      if (res.success) { updateCachedProfile(res.data); toast.success('Profil sekolah berhasil disimpan!'); }
    } catch { toast.error('Gagal menyimpan profil sekolah.'); }
    finally { setSaving(false); }
  };
  return (
    <div className="space-y-6 font-poppins pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Identitas & Profil Sekolah</h1>
      </div>
      {profile && (<form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Identitas & Informasi Pokok Pendidikan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Sekolah</label>
              <input
                type="text"
                value={(profile.name) ?? ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input
                type="text"
                value={(profile.npsn) ?? ''}
                onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Jenjang Pendidikan</label>
              <input
                type="text"
                value={(profile.education_level) ?? ''}
                onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Status Sekolah</label>
              <input
                type="text"
                value={(profile.status) ?? ''}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Akreditasi</label>
              <input
                type="text"
                value={(profile.accreditation) ?? ''}
                onChange={(e) => setProfile({ ...profile, accreditation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tahun Berdiri</label>
              <input
                type="text"
                value={(profile.founding_year) ?? ''}
                onChange={(e) => setProfile({ ...profile, founding_year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Telepon</label>
              <input
                type="text"
                value={(profile.phone) ?? ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nomor WhatsApp</label>
              <input
                type="text"
                value={(profile.whatsapp) ?? ''}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Email Sekolah</label>
              <input
                type="email"
                value={(profile.email) ?? ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Alamat Lengkap Sekolah</label>
            <textarea
              rows={2}
              value={(profile.address) ?? ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Deskripsi Ringkas Sekolah</label>
            <textarea
              rows={4}
              value={(profile.description) ?? ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Google Maps Embed URL</label>
            <input
              type="text"
              value={(profile.maps_embed_url) ?? ''}
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
        </form>)}
    </div>
  );
};
