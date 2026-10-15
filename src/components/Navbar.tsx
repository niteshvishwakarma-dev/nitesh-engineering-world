import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { SocialLinks } from './SocialLinks';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 py-3.5 shadow-2xl shadow-black/80'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Monogram Brand */}
        <a
          href="#"
          className="group flex items-center gap-3 text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm text-cyan-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
            <span>NV</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm text-white group-hover:text-cyan-300 transition-colors block">
              Nitesh Vishwakarma
            </span>
            <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
              Full-Stack Developer
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-400 transition-colors py-1 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Controls & Socials */}
        <div className="hidden md:flex items-center gap-4">
          <SocialLinks />

          <div className="h-4 w-[1px] bg-slate-800" />

          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'Admin Dashboard (Active Session)' : 'Administrator Portal'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isAdminLoggedIn
                ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-300 hover:text-white focus-visible:outline-none"
            title="Admin"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus-visible:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-6 flex flex-col gap-5 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3 text-sm font-mono text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <SocialLinks />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-cyan-500/40 text-cyan-300 bg-cyan-500/10"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
