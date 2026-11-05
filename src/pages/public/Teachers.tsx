import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { Teacher, Staff } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Search, GraduationCap, BookOpen, Briefcase, Mail } from 'lucide-react';

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'teachers' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolApi.getTeachers(), schoolApi.getStaff()])
      .then(([tRes, sRes]) => {
        setTeachers(tRes);
        setStaff(sRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.position.toLowerCase().includes(q);
    });
  }, [teachers, searchQuery]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.position.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
    });
  }, [staff, searchQuery]);

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Guru & Tenaga Kependidikan"
        description="Daftar profil dewan guru, asatidz, dan tenaga kependidikan SMP Islam Caruy dengan kualifikasi pendidikan dan mata pelajaran yang diampu."
      />
      <PageHeader
        title="Guru & Tenaga Kependidikan"
        subtitle="Profil dewan pendidik dan staf tata usaha yang berdedikasi membina generasi santri."
        badge="Civitas Akademika"
        breadcrumbs={[{ label: 'Guru & Staf' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Controls: Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({teachers.length + staff.length})
            </button>
            <button
              onClick={() => setFilterType('teachers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'teachers' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Guru Pengajar ({teachers.length})
            </button>
            <button
              onClick={() => setFilterType('staff')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'staff' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tenaga Kependidikan ({staff.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 transition-colors bg-stone-50/50"
            />
          </div>
        </div>

        {/* Section: Guru Pengajar */}
        {(filterType === 'all' || filterType === 'teachers') && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="text-xl font-bold text-stone-900">Dewan Guru Pengajar</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={teacher.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'}
                      alt={teacher.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl text-center shadow-sm border border-white/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {teacher.subject}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 space-y-2 text-center">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {teacher.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">{teacher.position}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 py-1 px-2 rounded-lg">
                      {teacher.last_education}
                    </p>
                    {teacher.short_bio && (
                      <p className="text-[11px] text-stone-500 font-normal leading-relaxed pt-1">
                        {teacher.short_bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Tenaga Kependidikan / Staf */}
        {(filterType === 'all' || filterType === 'staff') && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-xl font-bold text-stone-900">Tenaga Kependidikan & Tata Usaha</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStaff.map((staf) => (
                <div
                  key={staf.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={staf.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'}
                      alt={staf.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl text-center shadow-sm border border-white/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        {staf.department}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 space-y-2 text-center">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {staf.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">{staf.position}</p>
                    <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 py-1 px-2 rounded-lg">
                      {staf.last_education}
                    </p>
                    {staf.short_bio && (
                      <p className="text-[11px] text-stone-500 font-normal leading-relaxed pt-1">
                        {staf.short_bio}
                      </p>
                    )}
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
