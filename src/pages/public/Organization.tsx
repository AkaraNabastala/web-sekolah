import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { OrganizationMember } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Users, Shield, ArrowDown, UserCheck } from 'lucide-react';

export const Organization: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getOrganization()
      .then(res => setMembers(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const komite = members.find(m => m.level === 1);
  const kepalaSekolah = members.find(m => m.level === 2);
  const wakilDanTu = members.filter(m => m.level === 3);

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Struktur Organisasi"
        description="Bagan hierarki kepemimpinan, susunan komite sekolah, kepala sekolah, waka, dan tata usaha SMP Islam Caruy."
      />
      <PageHeader
        title="Struktur Organisasi"
        subtitle="Bagan kepemimpinan, komite, dan bidang manajerial SMP Islam Caruy."
        badge="Tata Kelola"
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Struktur Organisasi' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-100 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Hierarki Kepemimpinan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Bagan Struktur Organisasi Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Sinergi kepemimpinan profesional demi terwujudnya layanan pendidikan bermutu tinggi.
            </p>
          </div>

          {/* LEVEL 1: KOMITE SEKOLAH */}
          {komite && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 text-center shadow-sm space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md border-2 border-white">
                  <img src={komite.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300'} alt={komite.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-emerald-950 px-2.5 py-0.5 rounded-full">
                    {komite.position}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-2">{komite.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{komite.description}</p>
                </div>
              </div>
              <ArrowDown className="w-6 h-6 text-emerald-600 my-4" />
            </div>
          )}

          {/* LEVEL 2: KEPALA SEKOLAH */}
          {kepalaSekolah && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 text-center shadow-xl space-y-3 border-4 border-emerald-700/60">
                <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400">
                  <img src={kepalaSekolah.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300'} alt={kepalaSekolah.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest bg-amber-400 text-emerald-950 px-3 py-1 rounded-full">
                    {kepalaSekolah.position}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-2.5">{kepalaSekolah.name}</h3>
                  {kepalaSekolah.nip && kepalaSekolah.nip !== '-' && (
                    <p className="text-xs text-emerald-200 font-mono mt-0.5">NIP: {kepalaSekolah.nip}</p>
                  )}
                  <p className="text-xs text-emerald-100/90 font-normal mt-2 max-w-sm mx-auto">{kepalaSekolah.description}</p>
                </div>
              </div>
              <ArrowDown className="w-6 h-6 text-emerald-600 my-6" />
            </div>
          )}

          {/* LEVEL 3: WAKA & KA TU */}
          <div className="space-y-4">
            <h4 className="text-center text-xs font-bold uppercase tracking-wider text-stone-400">
              Unsur Pimpinan Bidang & Tata Usaha
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {wakilDanTu.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-2.5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-stone-200">
                    <img src={item.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {item.position}
                  </span>
                  <h5 className="font-bold text-xs text-stone-900 leading-snug">{item.name}</h5>
                  {item.description && (
                    <p className="text-[10px] text-stone-500 font-normal leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
