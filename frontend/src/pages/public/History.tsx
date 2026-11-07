import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { SchoolHistory } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Calendar, Flag, Award, Building, Sparkles } from 'lucide-react';

export const History: React.FC = () => {
  const [history, setHistory] = useState<SchoolHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getHistory()
      .then(res => setHistory(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Sejarah Perjalanan Sekolah"
        description="Sejarah, perjalanan, dan perkembangan sekolah akan ditampilkan setelah pengelola mengisi konten profil."
      />
      <PageHeader
        title="Sejarah Nama Sekolah Anda"
        subtitle="Jejak langkah perjuangan, dedikasi pendiri, dan tonggak kemajuan sekolah dari masa ke masa."
        badge="Napak Tilas"
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Sejarah Sekolah' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Main Article Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-100 space-y-8">
          <div className="space-y-3">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
              Kisah Perjalanan & Pendirian
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              {history?.title || 'Langkah Panjang Mengabdi: Sejarah Berdirinya Nama Sekolah Anda'}
            </h2>
            <div className="w-20 h-1 bg-amber-400 rounded-full"></div>
          </div>

          {/* Featured Image */}
          {history?.featured_image && (
            <div className="relative aspect-[16/8] rounded-2xl overflow-hidden shadow-md">
              <img
                src={history.featured_image}
                alt="Dokumentasi Sejarah Nama Sekolah Anda"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs font-normal">
                Dokumentasi: Perkembangan Kampus Terpadu Nama Sekolah Anda
              </div>
            </div>
          )}

          {/* Content Paragraphs */}
          <div className="text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            {history?.content ? (
              history.content.split('\n\n').map((par, i) => (
                <p key={i}>{par}</p>
              ))
            ) : (
              <p>Memuat informasi sejarah sekolah...</p>
            )}
          </div>
        </div>

        {/* Milestone Timeline */}
        {history?.milestones && history.milestones.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-100 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Tonggak Sejarah
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
                Milestone Perjalanan Sekolah
              </h3>
            </div>

            <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-10 pt-4">
              {history.milestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-md group-hover:bg-amber-500 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>

                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all space-y-2">
                    <div className="inline-block bg-emerald-800 text-amber-300 px-3 py-0.5 rounded-full text-xs font-bold">
                      Tahun {m.year}
                    </div>
                    <h4 className="text-lg font-bold text-stone-900">{m.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
