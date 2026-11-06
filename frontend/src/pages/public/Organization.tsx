import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { OrganizationMember } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Users } from 'lucide-react';

const OrganizationNode: React.FC<{ member: OrganizationMember; members: OrganizationMember[]; depth?: number }> = ({ member, members, depth = 0 }) => {
  const children = members
    .filter(item => item.parent_id === member.id)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="flex min-w-0 flex-col items-center">
      <article className={`w-full max-w-sm rounded-2xl border p-5 text-center shadow-sm transition-shadow hover:shadow-md ${depth === 0 ? 'border-[var(--school-secondary)] bg-white' : 'border-stone-200 bg-stone-50'}`}>
        {member.photo && (
          <img src={member.photo} alt={member.name} className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm" />
        )}
        <p className="text-xs font-semibold text-[var(--school-primary)]">{member.position}</p>
        <h3 className="mt-1 text-sm font-bold text-stone-900">{member.name}</h3>
        {member.nip && member.nip !== '-' && <p className="mt-1 text-[11px] text-stone-400">NIP: {member.nip}</p>}
        {member.description && <p className="mt-2 text-xs leading-relaxed text-stone-500">{member.description}</p>}
      </article>
      {children.length > 0 && (
        <>
          <div className="h-6 w-px bg-stone-300" aria-hidden="true" />
          <div className="grid w-full grid-cols-1 justify-items-center gap-4 border-t border-stone-200 pt-5 sm:grid-cols-2 xl:grid-cols-3">
            {children.map(child => <OrganizationNode key={child.id} member={child} members={members} depth={depth + 1} />)}
          </div>
        </>
      )}
    </div>
  );
};

export const Organization: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getOrganization()
      .then(res => setMembers(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const hasExplicitHierarchy = members.some(member => member.parent_id != null);
  const legacyCommittee = members.find(member => member.level === 1);
  const legacyPrincipal = members.find(member => member.level === 2);
  const hierarchy = hasExplicitHierarchy
    ? members
    : members.map(member => ({
        ...member,
        parent_id: member.level === 2 ? (legacyCommittee?.id ?? null) : member.level >= 3 ? (legacyPrincipal?.id ?? legacyCommittee?.id ?? null) : null
      }));
  const roots = hierarchy.filter(member => member.parent_id == null).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-stone-50 pb-24 font-poppins">
      <SEO title="Struktur Organisasi" description="Susunan jabatan dan hubungan kerja di lingkungan sekolah." />
      <PageHeader
        title="Struktur Organisasi"
        subtitle="Susunan kepemimpinan dan unit kerja sekolah."
        badge="Tata Kelola"
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Struktur Organisasi' }]}
      />
      <main className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-stone-100 bg-white p-5 shadow-xl sm:p-10">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-[var(--school-primary)]">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Bagan Organisasi Sekolah</h2>
          </div>
          {loading ? (
            <p className="py-12 text-center text-sm text-stone-500">Memuat struktur organisasi...</p>
          ) : roots.length ? (
            <div className="space-y-8">
              {roots.map(root => <OrganizationNode key={root.id} member={root} members={hierarchy} />)}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-stone-500">Struktur organisasi belum tersedia.</p>
          )}
        </section>
      </main>
    </div>
  );
};
