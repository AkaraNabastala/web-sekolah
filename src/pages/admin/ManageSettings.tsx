import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { WebsiteSettings } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { Save, CheckCircle, AlertCircle, Upload, Globe, Palette, Sliders } from 'lucide-react';

export const ManageSettings: React.FC = () => {
  const { updateCachedSettings } = useSchool();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    schoolApi.getSettings().then(res => setSettings(res));
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setSettings(prev => (prev ? { ...prev, logo_url: res.fileUrl } : null));
        showToast('Logo berhasil diunggah!');
      }
    } catch (err) {
      showToast('Gagal mengunggah logo.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateSettings(settings);
      if (res.success) {
        updateCachedSettings(res.data);
        showToast('Pengaturan website berhasil disimpan!');
      }
    } catch (err) {
      showToast('Gagal menyimpan pengaturan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-stone-500 font-['Poppins']">Memuat konfigurasi website...</div>;
  }

  return (
    <div className="space-y-6 font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Pengaturan Website & Branding</h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Konfigurasi nama sekolah, logo resmi, warna identitas, teks hero beranda, media sosial, dan SEO.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: IDENTITAS & LOGO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-extrabold text-stone-900">Branding & Logo Resmi</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Sekolah</label>
              <input
                type="text"
                required
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tagline / Slogan Sekolah</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Logo Sekolah (URL atau Unggah Berkas)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
              <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? '...' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: BERANDA & HERO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-extrabold text-stone-900">Konten Hero Beranda</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Headline Hero Beranda</label>
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Sub-Headline / Paragraf Sambutan Hero</label>
            <textarea
              rows={3}
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-light"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">URL Gambar Hero Utama</label>
            <input
              type="text"
              value={settings.hero_image}
              onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>
        </div>

        {/* SECTION 3: ANGKA STATISTIK BERANDA */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-extrabold text-stone-900">Angka Statistik Sekolah (Counter Beranda)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Siswa Aktif</label>
              <input
                type="number"
                value={settings.stats_students}
                onChange={(e) => setSettings({ ...settings, stats_students: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Guru & Tenaga Staf</label>
              <input
                type="number"
                value={settings.stats_teachers}
                onChange={(e) => setSettings({ ...settings, stats_teachers: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Prestasi Juara</label>
              <input
                type="number"
                value={settings.stats_achievements}
                onChange={(e) => setSettings({ ...settings, stats_achievements: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Total Alumni</label>
              <input
                type="number"
                value={settings.stats_alumni}
                onChange={(e) => setSettings({ ...settings, stats_alumni: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: MEDIA SOSIAL & SEO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-extrabold text-stone-900">Media Sosial & Optimasi SEO</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Instagram URL</label>
              <input
                type="text"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Facebook URL</label>
              <input
                type="text"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">TikTok URL</label>
              <input
                type="text"
                value={settings.tiktok_url}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Meta Title SEO</label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Meta Description SEO</label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-light"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Teks Copyright Footer</label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan Website'}</span>
        </button>
      </form>
    </div>
  );
};
