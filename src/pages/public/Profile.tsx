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
    <div className="font-['Poppins'] bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Profil & Identitas Sekolah"
        description="Identitas resmi, NPSN 20301988, Akreditasi A, status sekolah swasta, data kepala sekolah, dan karakteristik pendidikan SMP Islam Caruy."
      />
      <PageHeader
        title="Profil & Identitas Sekolah"
        subtitle="Mengenal lebih dekat identitas resmi, legalitas, dan komitmen mutu SMP Islam Caruy."
        badge="Tentang Sekolah"
        breadcrumbs={[{ label: 'Profil Sekolah' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Identitas Resmi Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100">
          <div className="border-b border-stone-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                Data Pokok Pendidikan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Identitas Resmi SMP Islam Caruy
              </h2>
            </div>
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Status: {profile?.status || 'Swasta'} Terakreditasi {profile?.accreditation || 'A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Nama Sekolah</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.name || 'SMP Islam Caruy'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">NPSN</p>
              <p className="text-base font-extrabold text-emerald-700">{profile?.npsn || '20301988'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Jenjang Pendidikan</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.education_level || 'Sekolah Menengah Pertama (SMP)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Status Sekolah</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.status || 'Swasta'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Peringkat Akreditasi</p>
              <p className="text-base font-extrabold text-amber-600">Predikat {profile?.accreditation || 'A (Unggul)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Tahun Berdiri</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.founding_year || '2005'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Kepala Sekolah</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.I'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Telepon / WhatsApp</p>
              <p className="text-base font-extrabold text-stone-900">{profile?.phone || '0821-3297-2773'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Email Resmi</p>
              <p className="text-base font-extrabold text-stone-900 truncate">{profile?.email || 'info@smpislamcaruy.sch.id'}</p>
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
          <h3 className="text-2xl font-extrabold text-stone-900">
            Deskripsi Umum & Karakteristik Satuan Pendidikan
          </h3>
          <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
          
          <div className="text-stone-600 text-sm sm:text-base leading-relaxed space-y-4 font-light">
            <p>
              {profile?.description || 'SMP Islam Caruy adalah lembaga pendidikan menengah pertama swasta bernuansa Islami yang berlokasi di Desa Caruy, Kecamatan Cipari, Kabupaten Cilacap.'}
            </p>
            <p>
              Penyelenggaraan pendidikan di SMP Islam Caruy dirancang dengan pendekatan holistik (menyeluruh). Di samping memenuhi kompetensi kurikulum nasional dari Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi, sekolah mengintegrasikan muatan lokal kepesantrenan seperti pembiasaan tadarus Al-Quran, Tahfidzul Quran terstruktur, bahasa Arab komunikatif, serta kajian fiqih ibadah praktis.
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
