import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { Achievement } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Trophy, Award, Medal, Calendar, MapPin, User } from 'lucide-react';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getAchievements()
      .then(res => setAchievements(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const levels = ['Semua', 'Kabupaten', 'Provinsi', 'Nasional'];

  const filtered = selectedLevel === 'Semua'
    ? achievements
    : achievements.filter(a => a.level === selectedLevel);

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Prestasi & Kejuaraan Siswa"
        description="Dokumentasi kejuaraan, medali, dan penghargaan yang diraih siswa dan santri SMP Islam Caruy di tingkat Kabupaten, Provinsi, dan Nasional."
      />
      <PageHeader
        title="Prestasi & Penghargaan"
        subtitle="Rangkaian capaian gemilang peserta didik dan lembaga di bidang akademik, sains, seni, keagamaan, dan olahraga."
        badge="Catatan Emas"
        breadcrumbs={[{ label: 'Prestasi' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Level Filter */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-stone-700">Tingkat Kompetisi:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-emerald-950 shadow-sm font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
            >
              {ach.photo && (
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={ach.photo}
                    alt={ach.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-400 text-emerald-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {ach.rank}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Tahun {ach.year}
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                    Tingkat {ach.level}
                  </span>
                  <span className="font-semibold text-stone-500">{ach.category}</span>
                </div>

                <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {ach.title}
                </h3>

                <div className="space-y-1 text-xs text-stone-600 font-normal">
                  <p>
                    <span className="font-semibold text-stone-700">Penerima:</span> {ach.student_or_team}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-700">Penyelenggara:</span> {ach.organizer}
                  </p>
                </div>

                {ach.description && (
                  <p className="text-xs text-stone-500 font-normal italic leading-relaxed pt-2 border-t border-stone-100">
                    "{ach.description}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
