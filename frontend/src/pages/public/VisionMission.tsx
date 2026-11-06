import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { SchoolVisionMission } from '../../types';
import { SEO } from '../../components/common/SEO';
import { useSchool } from '../../context/SchoolContext';
import { Compass, Target, HeartHandshake, Smile, GraduationCap, ShieldCheck } from 'lucide-react';

export const VisionMission: React.FC = () => {
  const [data, setData] = useState<SchoolVisionMission | null>(null);
  const { settings } = useSchool();

  useEffect(() => {
    schoolApi.getVisionMission().then(setData).catch(err => console.error(err));
  }, []);

  let featureFlags: Record<string, boolean> = {};
  try {
    featureFlags = typeof settings?.feature_flags === 'string'
      ? JSON.parse(settings.feature_flags)
      : (settings?.feature_flags || {});
  } catch {
    featureFlags = {};
  }
  const isEnabled = (key: string) => featureFlags[key] !== false;
  const values = data?.core_values || [];

  const getCoreValueIcon = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes('iman') || normalized.includes('taqwa')) return <HeartHandshake className="h-6 w-6" />;
    if (normalized.includes('akhlak')) return <Smile className="h-6 w-6" />;
    if (normalized.includes('akademik') || normalized.includes('intelektual')) return <GraduationCap className="h-6 w-6" />;
    return <ShieldCheck className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 font-poppins">
      <SEO title="Visi dan Misi" description="Visi, misi, tujuan, dan nilai utama sekolah." />
      <PageHeader title="Visi dan Misi" subtitle="Arah pengembangan dan tujuan pendidikan sekolah." badge="Profil Sekolah" breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Visi dan Misi' }]} />

      <main className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {isEnabled('vision') && data?.vision && (
          <section className="relative overflow-hidden rounded-3xl bg-[var(--school-primary)] p-8 text-white shadow-xl sm:p-12">
            <Compass className="absolute -right-8 -top-8 h-56 w-56 text-white/5" />
            <div className="relative max-w-4xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--school-secondary)]">Visi Sekolah</p>
              <h2 className="text-2xl font-semibold leading-relaxed sm:text-4xl">{data.vision}</h2>
              {data.vision_motto && <p className="text-sm text-white/75">{data.vision_motto}</p>}
            </div>
          </section>
        )}

        {(isEnabled('mission') || isEnabled('goals')) && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {isEnabled('mission') && (data?.missions?.length ?? 0) > 0 && (
              <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[var(--school-primary)]"><Compass className="h-5 w-5" /></div>
                  <h3 className="text-xl font-semibold text-stone-900">Misi</h3>
                </div>
                <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-[var(--school-primary)]">
                  {data?.missions.map((mission, index) => <li key={index} className="pl-2 text-sm leading-7 text-stone-700">{mission}</li>)}
                </ol>
              </section>
            )}

            {isEnabled('goals') && (data?.goals?.length ?? 0) > 0 && (
              <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[var(--school-primary)]"><Target className="h-5 w-5" /></div>
                  <h3 className="text-xl font-semibold text-stone-900">Tujuan Sekolah</h3>
                </div>
                <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-[var(--school-primary)]">
                  {data?.goals?.map((goal, index) => <li key={index} className="pl-2 text-sm leading-7 text-stone-700">{goal}</li>)}
                </ol>
              </section>
            )}
          </div>
        )}

        {isEnabled('coreValues') && values.length > 0 && (
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:p-10">
            <h3 className="mb-6 text-xl font-semibold text-stone-900">Nilai Utama Sekolah</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <article key={index} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--school-primary)] shadow-sm">{getCoreValueIcon(value.title)}</div>
                  <h4 className="font-semibold text-stone-900">{value.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{value.desc}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {!data && <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Memuat informasi visi dan misi...</p>}
      </main>
    </div>
  );
};
