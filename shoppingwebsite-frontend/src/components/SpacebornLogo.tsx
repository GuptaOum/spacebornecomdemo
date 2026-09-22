import React from 'react';

interface SpacebornLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'mono';
  subtitle?: boolean;
}

export const SpacebornLogo: React.FC<SpacebornLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'light',
  subtitle = true,
}) => {
  const iconSizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Aerodynamic Delta Apex Emblem matching uploaded spaceborn mark */}
      <div
        className={`${iconSizeMap[size]} rounded-lg bg-black flex items-center justify-center p-1.5 shadow-md shadow-black/20 shrink-0 border border-slate-800 transition-transform duration-200 hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Exact vector geometry of the uploaded Spaceborn chevron */}
          <path
            d="M25 66 C35 55 45 42 51 33 H58 L68 58 H60.5 L53.5 41 C48 49 38 58 25 66 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-baseline space-x-0.5">
            <span
              className={`${textSizes[size]} font-black tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              SPACEBORN
            </span>
            <span className={`${textSizes[size]} font-black tracking-tight text-[#EF4F12]`}>
              .IN
            </span>
          </div>
          {subtitle && (
            <p
              className={`text-[9.5px] font-semibold tracking-wider uppercase -mt-0.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              } hidden sm:block`}
            >
              Aerospace & Robotics Megastore
            </p>
          )}
        </div>
      )}
    </div>
  );
};
