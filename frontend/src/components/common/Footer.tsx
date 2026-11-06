import React from 'react';
import { ADMISSION_LABEL } from '../../config/admissions';
import { Link as RouterLink } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  MessageCircle,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { useSchool } from '../../context/SchoolContext';

type FeatureAwareLinkProps = React.ComponentProps<typeof RouterLink> & { feature?: string };

const Link: React.FC<FeatureAwareLinkProps> = ({ feature, ...props }) => {
  const { settings } = useSchool();
  let flags: any = settings?.feature_flags;
  if (typeof flags === 'string') {
    try { flags = JSON.parse(flags); } catch { flags = null; }
  }
  if (feature && flags?.[feature] === false) return null;
  return <RouterLink {...props} />;
};

export const Footer: React.FC = () => {
  const { profile, settings } = useSchool();

  return (
    <footer className="text-white font-poppins relative overflow-hidden border-t-4" style={{ backgroundColor: 'var(--school-primary)', borderTopColor: 'var(--school-secondary)' }}>
      {/* Decorative Islamic Arch Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/15">
          {/* Column 1: School Identity & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <SchoolLogo size="lg" lightText />
            <p className="text-emerald-200/90 text-xs leading-relaxed font-normal mt-3">
              {profile?.description || settings?.tagline || 'Informasi dan profil resmi sekolah.'}
            </p>

            

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-3">
              {settings?.instagram_url && <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 transition-all flex items-center justify-center text-emerald-200 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>}
              {settings?.facebook_url && <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 transition-all flex items-center justify-center text-emerald-200 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>}
              {settings?.youtube_url && <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 transition-all flex items-center justify-center text-emerald-200 shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>}
              {settings?.tiktok_url && <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>}
              {profile?.whatsapp && <a
                href={profile?.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}` : undefined}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" /><span>WhatsApp</span>
              </a>}
            </div>
          </div>

          {/* Column 2: Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Beranda Utama</span>
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Identitas & Profil Sekolah</span>
                </Link>
              </li>
              <li>
                <Link to="/sejarah" feature="history" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sejarah Perjalanan</span>
                </Link>
              </li>
              <li>
                <Link to="/visi-misi" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visi, Misi & Nilai Utama</span>
                </Link>
              </li>
              <li>
                <Link to="/organisasi" feature="organization" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Struktur Organisasi</span>
                </Link>
              </li>
              <li>
                <Link to="/guru-staf" feature="teachers" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guru & Tenaga Kependidikan</span>
                </Link>
              </li>
              <li>
                <Link to="/berita" feature="news" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Berita, Agenda & Pengumuman</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Fasilitas & PPDB (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Layanan & Info
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link to="/ppdb" feature="ppdb" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 font-semibold text-amber-300">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Informasi {ADMISSION_LABEL}</span>
                </Link>
              </li>
              <li>
                <Link to="/prestasi" feature="achievements" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Galeri Prestasi Siswa</span>
                </Link>
              </li>
              <li>
                <Link to="/fasilitas" feature="facilities" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sarana & Fasilitas</span>
                </Link>
              </li>
              <li>
                <Link to="/galeri" feature="gallery" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dokumentasi Foto & Video</span>
                </Link>
              </li>
              <li>
                <Link to="/kontak" feature="contact" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim Pesan / Kontak</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Lokasi (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/70"></span>
              Kontak Sekolah
            </h4>

            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                {profile?.address && <span>{profile.address}</span>}
              </div>
              {profile?.phone && <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${profile.phone}`} className="hover:text-white">{profile.phone}</a>
              </div>}
              {profile?.email && <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
              </div>}
              
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-300/80">
          <p>
            {settings?.footer_text || `© ${new Date().getFullYear()} ${settings?.school_name || profile?.name || 'Sekolah'}. Hak cipta dilindungi.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/kontak" feature="contact" className="hover:text-white transition-colors">Kontak Sekolah</Link>
            <span className="text-white/30">•</span>
            <span className="text-white/70">Website sekolah dikembangkan oleh <span className="font-semibold" style={{ color: 'var(--school-secondary)' }}>Nabastala</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
