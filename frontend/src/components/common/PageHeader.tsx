import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge = 'Website Sekolah',
  breadcrumbs = []
}) => {
  return (
    <div className="relative bg-[#132A1E] text-white pt-16 pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden font-['Poppins',sans-serif]">
      {/* Decorative Subtle Geometric Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E5C178]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#C5D5CA] mb-4">
          <Link to="/" className="hover:text-[#E8CF94] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              {b.href ? (
                <Link to={b.href} className="hover:text-[#E8CF94] transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-[#E8CF94] font-medium">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge & Title */}
        <div className="space-y-2">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E6EFE9] text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C178]"></span>
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF9F5]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#D5E0D7] text-sm md:text-base max-w-2xl font-normal leading-relaxed pt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
