import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-navy-900 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-light-blue/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-opti-orange/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="glass-card p-8 shadow-2xl border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
            <p className="text-slate-400">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};
