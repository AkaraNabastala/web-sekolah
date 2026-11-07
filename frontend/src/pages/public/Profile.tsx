import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { useSchool } from '../../context/SchoolContext';
import { SEO } from '../../components/common/SEO';
import { ShieldCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile } = useSchool();

  const details = [
    { label: 'NPSN', value: profile?.npsn },
    { label: 'Jenjang Pendidikan', value: profile?.education_level },
    { label: 'Status Sekolah', value: profile?.status },
    { label: 'Akreditasi', value: profile?.accreditation },
    { label: 'Tahun Berdiri', value: profile?.founding_year },
    { label: 'Kepala Sekolah', value: profile?.headmaster_name },
    { label: 'Telepon', value: profile?.phone },
    { label: 'Email', value: profile?.email }
  ].filter(item => item.value != null && String(item.value).trim() !== '');

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] text-[#2C332D] min-h-screen pb-24">
      <SEO
        title="Profil Sekolah"
        description={profile?.description || 'Profil dan identitas sekolah.'}
      />
      <PageHeader
        title="Profil Sekolah"
        subtitle="Identitas dan informasi sekolah."
        badge="Tentang Sekolah"
        breadcrumbs={[{ label: 'Profil Sekolah' }]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-8 relative z-20 space-y-12">
        {(profile?.name || details.length > 0 || profile?.address) && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E7E2D8]">
            <div className="border-b border-[#EFECE6] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#2A5C40] font-bold text-xs uppercase tracking-wider">
                  Data Pokok Pendidikan
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] mt-1">
                  {profile?.name || 'Identitas Sekolah'}
                </h2>
              </div>
              {profile?.status && (
                <div className="bg-[#E8EFEA] text-[#1D4A32] border border-[#D1E0D5] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2A5C40]" />
                  <span>{profile.status}</span>
                </div>
              )}
            </div>

            {details.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {details.map(item => (
                  <div key={item.label} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{item.label}</p>
                    <p className="text-base font-bold text-stone-900 break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {profile?.address && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Alamat Sekolah</p>
                <p className="text-sm font-medium text-stone-800">{profile.address}</p>
              </div>
            )}
          </section>
        )}

        {profile?.description && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <h3 className="text-2xl font-bold text-stone-900">Tentang Sekolah</h3>
            <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
