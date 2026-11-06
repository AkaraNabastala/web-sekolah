import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { SEO } from '../../components/common/SEO';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { schoolApi } from '../../services/api';
import { Award, BookOpen, Clock, Users, Check, Sparkles } from 'lucide-react';

export const Programs: React.FC = () => {
  const { pathname } = useLocation();
  const routeCategory = pathname === '/kurikulum'
    ? 'akademik'
    : pathname === '/ekstrakurikuler'
      ? 'ekstrakurikuler'
      : 'unggulan';
  const pageTitle = pathname === '/kurikulum'
    ? 'Kurikulum & Program Akademik'
    : pathname === '/ekstrakurikuler'
      ? 'Ekstrakurikuler'
      : 'Program Unggulan';
  const pageDescription = pathname === '/kurikulum'
    ? 'Informasi kurikulum lengkap akan ditampilkan setelah data resmi sekolah dimasukkan. Daftar di bawah ini memuat program akademik yang tercatat di sistem.'
    : pathname === '/ekstrakurikuler'
      ? 'Daftar kegiatan ekstrakurikuler yang dikelola dan dipublikasikan sekolah.'
      : 'Program unggulan sekolah yang dikelola dan dipublikasikan melalui sistem informasi sekolah.';
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState(routeCategory);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCat(routeCategory);
    setLoading(true);
    schoolApi.getPrograms()
      .then(res => setPrograms(res))
      .catch(err => {
        console.error('Gagal memuat daftar program:', err);
        setLoadError('Daftar program belum dapat dimuat. Silakan coba beberapa saat lagi.');
        setPrograms([]);
      })
      .finally(() => setLoading(false));
  }, [routeCategory]);

  const categories = [
    { id: 'all', label: 'Semua Program' },
    { id: 'unggulan', label: 'Program Unggulan' },
    { id: 'keagamaan', label: 'Keagamaan & Adab' },
    { id: 'akademik', label: 'Akademik & Sains' },
    { id: 'ekstrakurikuler', label: 'Ekstrakurikuler' }
  ];

  const filtered = selectedCat === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCat);

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] min-h-screen text-[#2C332D]">
      <SEO
        title={pageTitle}
        description={pageDescription}
      />

      <PageHeader
        title={pageTitle}
        subtitle={pageDescription}
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Akademik', href: '#' },
          { label: pageTitle, href: pathname }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 space-y-12">
        {/* Category Tabs */}
        <ScrollReveal animation="fade-up" className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === c.id
                  ? 'bg-[#1B3B2B] text-white shadow-md'
                  : 'bg-white text-[#5C645D] hover:bg-[#E8EFEA] hover:text-[#1D4A32] border border-[#ECE7DD]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Grid of Programs */}
        {loading ? (
          <div className="py-16 text-center text-sm text-[#7A827B]">Memuat daftar program...</div>
        ) : loadError ? (
          <div role="alert" className="py-12 text-center text-sm text-amber-800">{loadError}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A827B]">Belum ada data untuk kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={idx * 100}
                className="bg-white rounded-3xl overflow-hidden border border-[#ECE7DD] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#EAE5DC] relative">
                    <img
                      src={item.photo || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800'}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-[#132A1E]/85 text-white backdrop-blur-md uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-[#1F2621]">{item.name}</h3>
                    <p className="text-xs text-[#5C645D] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2 border-t border-[#F2EFE9] mt-4">
                  {item.schedule_info && (
                    <div className="flex items-center gap-2 text-xs text-[#2A5C40] pt-3">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">{item.schedule_info}</span>
                    </div>
                  )}
                  {item.instructor && (
                    <div className="flex items-center gap-2 text-xs text-[#7A827B]">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.instructor}</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
