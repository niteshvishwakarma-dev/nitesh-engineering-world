import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 py-16 relative z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                NV
              </div>
              <span className="font-bold tracking-tight text-white text-base">
                Nitesh Vishwakarma
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Full-Stack Software Engineer · React & Python FastAPI Architecture
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">
              Skills
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
            <button
              onClick={onOpenAdmin}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-400/90"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Channels */}
          <SocialLinks />

        </div>

        {/* Bottom Specs */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {currentYear} Nitesh Vishwakarma. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-cyan-400/80 text-[11px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Interactive 3D Experience · Authentic Database Persistence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
