import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { SchoolVisionMission } from '../../types';
import { SEO } from '../../components/common/SEO';
import {
  Sparkles,
  CheckCircle2,
  Target,
  HeartHandshake,
  Smile,
  GraduationCap,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const VisionMission: React.FC = () => {
  const [data, setData] = useState<SchoolVisionMission | null>(null);

  useEffect(() => {
    schoolApi.getVisionMission()
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  const getCoreValueIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('iman') || t.includes('taqwa')) return <HeartHandshake className="w-6 h-6 text-amber-500" />;
    if (t.includes('akhlak')) return <Smile className="w-6 h-6 text-emerald-600" />;
    if (t.includes('akademik') || t.includes('intelektual')) return <GraduationCap className="w-6 h-6 text-sky-600" />;
    return <ShieldCheck className="w-6 h-6 text-orange-500" />;
  };

  return (
    <div className="font-['Poppins'] bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Visi, Misi & Nilai Utama"
        description="Visi, misi terpadu, tujuan pendidikan, dan 4 pilar nilai karakter utama di SMP Islam Caruy Cipari Cilacap."
      />
      <PageHeader
        title="Visi, Misi & Nilai Utama"
        subtitle="Arah haluan, cita-cita luhur, dan komitmen pembentukan karakter generasi muslim unggul."
        badge="Haluan Sekolah"
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Visi & Misi' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* VISI SEKOLAH HERO CARD */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Compass className="w-72 h-72 text-white" />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Visi Utama
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-snug tracking-tight text-white">
              "{data?.vision || 'Terwujudnya Generasi Muslim yang Berakhlakul Karimah, Unggul dalam Prestasi Akademik dan Non-Akademik, Menguasai IPTEK, serta Berwawasan Lingkungan.'}"
            </h2>
            {data?.vision_motto && (
              <p className="text-amber-300 text-sm font-semibold tracking-wide italic">
                Motto: {data.vision_motto}
              </p>
            )}
          </div>
        </div>

        {/* MISI & TUJUAN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Misi Sekolah */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-stone-900">Misi Sekolah</h3>
                <p className="text-xs text-stone-500 font-light">Langkah strategis perwujudan visi</p>
              </div>
            </div>

            <ul className="space-y-4">
              {data?.missions.map((misi, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{misi}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tujuan Sekolah */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-stone-900">Tujuan Satuan Pendidikan</h3>
                <p className="text-xs text-stone-500 font-light">Sasaran capaian peserta didik</p>
              </div>
            </div>

            <ul className="space-y-4">
              {data?.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NILAI UTAMA SEKOLAH (CORE VALUES) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-100 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Karakter Utama
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Nilai-Nilai Luhur Santri SMP Islam Caruy
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Pedoman tingkah laku dan pembentukan kepribadian yang dibiasakan setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.core_values.map((val, idx) => (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/50 p-6 rounded-2xl border border-stone-200/80 transition-all hover:shadow-md space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-stone-100">
                  {getCoreValueIcon(val.title)}
                </div>
                <h4 className="font-bold text-stone-900 text-base">{val.title}</h4>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
