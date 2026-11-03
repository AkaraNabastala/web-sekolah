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
  badge = 'SMP Islam Caruy',
  breadcrumbs = []
}) => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-['Poppins']">
      {/* Decorative Islamic Geometric Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-emerald-200/90 mb-4">
          <Link to="/" className="hover:text-amber-300 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
              {b.href ? (
                <Link to={b.href} className="hover:text-amber-300 transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-amber-300 font-medium">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge & Title */}
        <div className="space-y-2">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl font-light leading-relaxed pt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
