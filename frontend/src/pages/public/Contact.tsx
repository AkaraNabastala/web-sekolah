import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { useSchool } from '../../context/SchoolContext';
import { schoolApi } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { profile } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await schoolApi.sendContactMessage(formData);
      if (res.success) {
        setSuccessMsg('Alhamdulillah, pesan Anda berhasil terkirim ke sekretariat sekolah. Kami akan segera merespons.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] text-[#2C332D] min-h-screen pb-24">
      <SEO
        title="Kontak & Lokasi Sekolah"
        description="Alamat resmi, peta Google Maps, nomor WhatsApp, email, dan formulir pengiriman pesan langsung ke sekretariat Nama Sekolah Anda."
      />
      <PageHeader
        title="Kontak & Lokasi Sekolah"
        subtitle="Hubungi kami untuk informasi pendaftaran, kerja sama, dan layanan administrasi sekolah."
        badge="Layanan Komunikasi"
        breadcrumbs={[{ label: 'Kontak' }]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-8 relative z-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Informasi Kontak & Jam Kerja (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E7E2D8] space-y-6">
              <div className="space-y-1">
                <span className="text-[#2A5C40] text-xs font-bold uppercase tracking-wider">
                  Informasi Sekretariat
                </span>
                <h3 className="text-xl font-bold text-[#1F2621]">
                  Kantor Nama Sekolah Anda
                </h3>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-stone-600 font-normal">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">Alamat Sekolah:</p>
                    <p className="mt-0.5 leading-relaxed">{profile?.address || 'Alamat sekolah belum diisi'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">Telepon & WhatsApp:</p>
                    <p className="mt-0.5">{profile?.phone || '0821-3297-2773'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">Email Resmi:</p>
                    <p className="mt-0.5">{profile?.email || 'Email sekolah belum diisi'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 border-t border-stone-100 pt-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">Waktu Layanan Administrasi:</p>
                    <p className="mt-0.5 text-xs text-stone-500">Senin - Kamis & Sabtu: 07.00 - 14.00 WIB</p>
                    <p className="text-xs text-stone-500">Jumat: 07.00 - 11.00 WIB</p>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">Hari Ahad & Libur Nasional Tutup</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Consultation Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full">
                Fast Response
              </span>
              <h4 className="text-lg font-bold">Konsultasi via WhatsApp</h4>
              <p className="text-xs text-emerald-100 font-normal leading-relaxed">
                Butuh tanggapan cepat mengenai pendaftaran peserta didik baru atau informasi program sekolah? Tim kami siap melayani chat Anda.
              </p>
              {profile?.whatsapp && (
                <a
                  href={`https://wa.me/${String(profile.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Halo, saya ingin bertanya kepada ${profile?.name || 'pihak sekolah'}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Buka WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Formulir Kirim Pesan (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Kotak Surat Pengunjung
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Kirimkan Pertanyaan atau Saran
              </h3>
              <p className="text-xs text-stone-500 font-normal mt-1">
                Pesan akan langsung diteruskan ke dashboard administrator sekolah.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={(formData.name) ?? ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={(formData.email) ?? ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={(formData.phone) ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Subjek Pesan *</label>
                  <input
                    type="text"
                    required
                    value={(formData.subject) ?? ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Isi Pesan *</label>
                <textarea
                  rows={4}
                  required
                  value={(formData.message) ?? ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Mengirimkan...' : 'Kirim Pesan Sekarang'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Peta Lokasi Google Maps */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#ECE7DD] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#2A5C40] text-xs font-bold uppercase tracking-wider">
                Peta Lokasi Interaktif
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F2621]">
                Kunjungi Kampus Nama Sekolah Anda
              </h3>
              <p className="text-xs text-[#5C645D] font-normal">
                Informasi lokasi akan ditampilkan setelah alamat sekolah diisi melalui panel pengelola.
              </p>
            </div>
            {profile?.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#E8CF94] hover:bg-[#DEBD7A] text-[#1B3B2B] text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-all self-start sm:self-auto"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {profile?.maps_embed_url ? (
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-[#ECE7DD]">
              <iframe
                src={profile.maps_embed_url}
                title={`Peta lokasi ${profile.name || 'sekolah'}`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-500">
              Peta lokasi akan tampil setelah URL Google Maps diisi melalui profil sekolah.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
