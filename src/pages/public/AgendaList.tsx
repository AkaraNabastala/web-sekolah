import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SEO } from '../../components/common/SEO';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { schoolApi } from '../../services/api';
import { Calendar, Clock, MapPin, Search, ChevronRight } from 'lucide-react';

export const AgendaList: React.FC = () => {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getAgendas()
      .then(res => setAgendas(res))
      .catch(() => setAgendas([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = agendas.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] min-h-screen text-[#2C332D]">
      <SEO
        title="Agenda & Pengumuman Sekolah"
        description="Jadwal kegiatan akademik, ujian santri, kalender pendidikan, dan pengumuman resmi SMP Islam Caruy."
      />

      <PageHeader
        title="Agenda & Pengumuman"
        subtitle="Jadwal kegiatan resmi, kalender akademik santri, dan pengumuman berkala SMP Islam Caruy."
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Informasi', href: '#' },
          { label: 'Agenda & Pengumuman', href: '/agenda' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 space-y-10">
        {/* Search Bar */}
        <ScrollReveal animation="fade-up" className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-3 border border-[#ECE7DD] shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-[#2A5C40] ml-2" />
            <input
              type="text"
              placeholder="Cari agenda atau pengumuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm bg-transparent focus:outline-none text-[#1F2621]"
            />
          </div>
        </ScrollReveal>

        {/* List of Agendas */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#7A827B]">Memuat agenda kegiatan...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#ECE7DD] space-y-3">
              <Calendar className="w-12 h-12 text-[#2A5C40]/40 mx-auto" />
              <p className="text-base font-bold text-[#1F2621]">Belum Ada Agenda Terjadwal</p>
              <p className="text-xs text-[#5C645D]">Informasi kegiatan resmi berikutnya akan diumumkan di halaman ini.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isPast = item.event_date < today;
              return (
                <ScrollReveal
                  key={item.id}
                  animation="fade-up"
                  delay={idx * 100}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECE7DD] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-5">
                    {/* Date Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-[#E8EFEA] text-[#1D4A32] flex flex-col items-center justify-center shrink-0 border border-[#D5E0D7]">
                      <span className="text-xs uppercase font-bold text-[#2A5C40]">
                        {new Date(item.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                      <span className="text-xl font-bold text-[#1F2621]">
                        {new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isPast ? 'bg-[#ECE7DD] text-[#7A827B]' : 'bg-[#E8EFEA] text-[#1D4A32]'}`}>
                          {isPast ? 'Selesai' : 'Mendatang'}
                        </span>
                        <span className="text-xs text-[#7A827B]">{item.organizer || 'SMP Islam Caruy'}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1F2621]">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-[#5C645D] leading-relaxed max-w-xl font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] shrink-0 text-xs text-[#5C645D]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2A5C40]" />
                      <span>{item.start_time} - {item.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2A5C40]" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaList;
