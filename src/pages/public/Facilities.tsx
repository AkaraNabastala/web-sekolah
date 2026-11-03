import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { Facility } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Building, Users, CheckCircle, Shield } from 'lucide-react';

export const Facilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getFacilities()
      .then(res => setFacilities(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Semua', 'Ruang Belajar', 'Laboratorium', 'Fasilitas Ibadah', 'Perpustakaan', 'Lapangan'];

  const filtered = selectedCat === 'Semua'
    ? facilities
    : facilities.filter(f => f.category === selectedCat || (selectedCat === 'Fasilitas Lain' && !categories.includes(f.category)));

  return (
    <div className="font-['Poppins'] bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Sarana & Fasilitas Sekolah"
        description="Daftar sarana dan prasarana belajar SMP Islam Caruy: Ruang Kelas Ber-AC, Laboratorium Komputer & IPA, Perpustakaan, Musholla At-Tarbiyah, dan Lapangan Olahraga."
      />
      <PageHeader
        title="Sarana & Fasilitas Sekolah"
        subtitle="Dukungan infrastruktur modern, representatif, dan aman untuk mengoptimalkan potensi belajar santri."
        badge="Infrastruktur Kampus"
        breadcrumbs={[{ label: 'Fasilitas' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Category Filter */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-700">Kategori Sarana:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                <img
                  src={fac.photo}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {fac.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                  {fac.condition_status || 'Sangat Baik'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {fac.name}
                  </h3>
                  {fac.capacity && (
                    <span className="text-[11px] text-stone-400 font-medium shrink-0 ml-2">
                      Kapasitas: {fac.capacity}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {fac.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
