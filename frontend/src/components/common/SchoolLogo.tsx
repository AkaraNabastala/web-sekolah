import React, { useState } from 'react';
import defaultLogo from '../../assets/logo.png';
import { useSchool } from '../../context/SchoolContext';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false
}) => {
  const [imgError, setImgError] = useState(false);
  const { settings, profile } = useSchool();
  const schoolName = settings?.school_name || profile?.name || 'Nama Sekolah';
  const tagline = settings?.tagline || 'Website Resmi Sekolah';
  const logoSrc = settings?.logo_url && !settings.logo_url.includes('/src/assets/logo.png') ? settings.logo_url : defaultLogo;
  const initials = schoolName.split(/\s+/).filter(Boolean).slice(0, 3).map(word => word[0]).join('').toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} shrink-0 flex items-center justify-center overflow-hidden`}>
        {!imgError ? (
          <img
            src={logoSrc}
            alt={`Logo ${schoolName}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-current font-bold">
            <span className="text-xs">{initials}</span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className={`font-bold uppercase tracking-tight ${textSizeClasses[size]} ${lightText ? 'text-white' : 'text-emerald-950'}`}>
            <span>{schoolName}</span>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-semibold ${lightText ? 'text-emerald-200' : 'text-emerald-700'}`}>
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};
