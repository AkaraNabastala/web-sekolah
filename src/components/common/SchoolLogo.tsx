import React, { useState } from 'react';
import defaultLogo from '../../assets/logo.png';

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
      <div className={`relative ${sizeClasses[size]} shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-white/10 p-0.5 shadow-sm`}>
        {!imgError ? (
          <img
            src={defaultLogo}
            alt="Logo SMP Islam Caruy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        ) : (
          <div className="w-full h-full bg-emerald-800 rounded-lg flex items-center justify-center text-amber-400 font-bold border border-amber-300/40">
            <span className="text-xs">SIC</span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className={`font-bold uppercase tracking-tight ${textSizeClasses[size]} ${lightText ? 'text-white' : 'text-emerald-950'}`}>
            <span>SMP ISLAM </span>
            <span className="text-emerald-600 font-bold">CARUY</span>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-semibold ${lightText ? 'text-emerald-200' : 'text-emerald-700'}`}>
            Cerdas • Berkarakter • Islami
          </span>
        </div>
      )}
    </div>
  );
};
