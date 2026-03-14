import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <svg className="w-48 h-48" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4DA8CC' }} />
            <stop offset="100%" style={{ stopColor: '#7FC8E8' }} />
          </linearGradient>
          <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F7931E' }} />
            <stop offset="100%" style={{ stopColor: '#E84D1E' }} />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle 
          className="animate-draw-ring" 
          cx="100" cy="100" r="72" 
          fill="none" stroke="url(#pg)" strokeWidth="4" opacity="0.8" 
        />

        {/* Orbit 1 group */}
        <g className="animate-spin-orbit-1 origin-[100px_100px]">
          <ellipse 
            className="animate-draw-orbit" 
            cx="100" cy="100" rx="52" ry="22" 
            fill="none" stroke="url(#ag)" strokeWidth="3" 
            transform="rotate(-28, 100, 100)" strokeLinecap="round"
            style={{ animationDelay: '0.6s' }}
          />
        </g>

        {/* Orbit 2 group */}
        <g className="animate-spin-orbit-2 origin-[100px_100px]">
          <ellipse 
            className="animate-draw-orbit" 
            cx="100" cy="100" rx="52" ry="22" 
            fill="none" stroke="url(#ag)" strokeWidth="3" 
            transform="rotate(28, 100, 100)" strokeLinecap="round" 
            opacity="0.6"
            style={{ animationDelay: '0.8s' }}
          />
        </g>

        {/* Connection lines */}
        <line className="animate-draw-conn" x1="52" y1="72" x2="62" y2="80" stroke="url(#pg)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <line className="animate-draw-conn" x1="138" y1="120" x2="148" y2="128" stroke="url(#pg)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" style={{ animationDelay: '1.7s' }} />

        {/* Core */}
        <g className="animate-core-pulse origin-[100px_100px]">
          <circle className="animate-pop-core origin-[100px_100px]" cx="100" cy="100" r="11" fill="url(#ag)" style={{ animationDelay: '1.0s' }} />
          <circle className="animate-pop-core origin-[100px_100px]" cx="100" cy="100" r="5.5" fill="#0A1A2A" style={{ animationDelay: '1.15s' }} />
        </g>

        {/* Nodes */}
        <circle className="animate-pop-node origin-[144px_78px]" cx="144" cy="78" r="4.5" fill="url(#pg)" style={{ animationDelay: '1.3s' }} />
        <circle className="animate-pop-node origin-[56px_122px]" cx="56" cy="122" r="4.5" fill="url(#pg)" style={{ animationDelay: '1.45s' }} />
        <circle className="animate-pop-node origin-[132px_134px]" cx="132" cy="134" r="3.5" fill="url(#ag)" opacity="0.75" style={{ animationDelay: '1.6s' }} />
        <circle className="animate-pop-node origin-[68px_66px]" cx="68" cy="66" r="3.5" fill="url(#ag)" opacity="0.75" style={{ animationDelay: '1.75s' }} />

        {/* Forward arrow */}
        <g className="animate-arrow-pulse origin-[166px_100px]">
          <path className="animate-draw-arrow" d="M 158,91 L 176,100 L 158,109" fill="none" stroke="url(#ag)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      
      <div className="flex flex-col items-center">
        <div className="flex items-baseline text-5xl tracking-tighter">
          <span className="font-light text-white">Opti</span>
          <span className="font-black text-gradient-orange">NXt</span>
        </div>
        <div className="h-0.5 w-48 bg-linear-to-r from-transparent via-opti-orange/40 to-transparent mt-2"></div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium mt-2">
          Enterprise AI · Workforce Intelligence
        </span>
      </div>
    </div>
  );
};
