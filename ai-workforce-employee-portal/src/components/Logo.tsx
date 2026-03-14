import React from 'react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center select-none group w-full">
      <div className="flex items-baseline justify-center">
        <span className="text-2xl font-bold text-slate-900 tracking-tighter">Opti</span>
        <span className="text-2xl font-black text-[#F7931E] tracking-tighter flex items-center">
          NXt
          <span className="ml-0.5 text-[#F7931E] text-2xl font-black">+</span>
        </span>
      </div>
      <div className="flex flex-col w-full mt-1 items-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F7931E]/50 to-transparent mb-1.5"></div>
        <div className="text-[7px] font-extrabold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap text-center">
          Enterprise AI <span className="text-[#F7931E] mx-1">•</span> Workforce Intelligence
        </div>
      </div>
    </div>
  );
};

export default Logo;
