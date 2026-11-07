import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { useSchool } from '../../context/SchoolContext';
import { SEO } from '../../components/common/SEO';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  User,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Globe
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile } = useSchool();

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] text-[#2C332D] min-h-screen pb-24">
      <SEO
        title="Profil & Identitas Sekolah"
        description="Identitas resmi, status sekolah, data kelembagaan, dan karakteristik pendidikan Nama Sekolah Anda."
      />
      <PageHeader
        title="Profil & Identitas Sekolah"
        subtitle="Mengenal lebih dekat identitas resmi, legalitas, dan komitmen mutu Nama Sekolah Anda."
        badge="Tentang Sekolah"
        breadcrumbs={[{ label: 'Profil Sekolah' }]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-8 relative z-20 space-y-12">
        {/* Identitas Resmi Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E7E2D8]">
          <div className="border-b border-[#EFECE6] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#2A5C40] font-bold text-xs uppercase tracking-wider">
                Data Pokok Pendidikan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] mt-1">
                Identitas Resmi Nama Sekolah Anda
              </h2>
            </div>
            <div className="bg-[#E8EFEA] text-[#1D4A32] border border-[#D1E0D5] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A5C40]" />
              <span>Status: {profile?.status || 'Swasta'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Nama Sekolah</p>
              <p className="text-base font-bold text-stone-900">{profile?.name || 'Nama Sekolah Anda'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">NPSN</p>
              <p className="text-base font-bold text-emerald-700">{profile?.npsn || 'Dalam Proses Pembaruan'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Jenjang Pendidikan</p>
              <p className="text-base font-bold text-stone-900">{profile?.education_level || 'Sekolah Menengah Pertama (SMP)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Status Sekolah</p>
              <p className="text-base font-bold text-stone-900">{profile?.status || 'Swasta'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Peringkat Akreditasi</p>
              <p className="text-base font-bold text-amber-600">{profile?.accreditation ? `Predikat ${profile.accreditation}` : 'Dalam Proses Akreditasi'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Tahun Berdiri</p>
              <p className="text-base font-bold text-stone-900">{profile?.founding_year || 'Dalam Proses Verifikasi'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Kepala Sekolah</p>
              <p className="text-base font-bold text-stone-900">{profile?.headmaster_name || 'Kepala Sekolah Nama Sekolah Anda'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Telepon / WhatsApp</p>
              <p className="text-base font-bold text-stone-900">{profile?.phone || 'Informasi Belum Tersedia'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Email Resmi</p>
              <p className="text-base font-bold text-stone-900 truncate">{profile?.email || 'Informasi Belum Tersedia'}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Alamat Lengkap Sekolah</p>
            <p className="text-sm font-medium text-stone-800">
              {profile?.address || 'Jl. Raya Caruy No. 12, Desa Caruy, Kec. Cipari, Kabupaten Cilacap, Jawa Tengah 53262'}
            </p>
          </div>
        </div>

        {/* Deskripsi & Filosofi */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
          <h3 className="text-2xl font-bold text-stone-900">
            Deskripsi Umum & Karakteristik Satuan Pendidikan
          </h3>
          <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
          
          <div className="text-stone-600 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            <p>
              {profile?.description || 'Nama Sekolah Anda adalah lembaga pendidikan menengah pertama swasta bernuansa Islami yang berlokasi di Desa Caruy, Kecamatan Cipari, Kabupaten Cilacap.'}
            </p>
            <p>
              Pendidikan di Nama Sekolah Anda mengikuti kurikulum nasional dengan penguatan pendidikan agama Islam, karakter, dan budi pekerti.
            </p>
            <p>
              Iklim sekolah yang asri, tenang, dan jauh dari kebisingan kota menciptakan suasana yang sangat kondusif untuk menumbuhkan minat belajar, kematangan budi pekerti, dan kepedulian sosial terhadap sesama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
