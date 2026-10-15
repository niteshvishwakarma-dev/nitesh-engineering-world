import React, { useRef, useState } from 'react';
import { ArrowDown, Github, Mail, ArrowUpRight, Sparkles, Terminal, Cpu, Camera, Upload } from 'lucide-react';
import { Hero3DScene } from '../components/canvas/Hero3DScene';
import { TiltCard } from '../components/TiltCard';
import { TypewriterTagline } from '../components/TypewriterTagline';
import { SocialLinks } from '../components/SocialLinks';
import { api } from '../services/api';

interface HeroProps {
  photoUrl?: string;
  onPhotoUpdated?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ photoUrl = '/nitesh-photo.png', onPhotoUpdated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadPhotoDirect(reader.result as string);
        if (onPhotoUpdated) {
          onPhotoUpdated(res.assetPath);
        }
      } catch (err: any) {
        alert(err.message || 'Failed to upload photo');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
     

      {/* 3D Atmospheric Background Light Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Cyber Grid Subtle Perspective Overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Badges, & Action Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Top Static Heading */}
            <div className="mb-4">
              <div className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase mb-2">
                WELCOME TO
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-sm">
                NITESH'S ENGINEERING WORLD
              </h1>
            </div>

            {/* Below the Heading — Typewriter Tagline */}
            <div className="mb-8 min-h-[2.5rem]">
              <TypewriterTagline text="Building the Future, One Line of Code at a Time." />
            </div>

            {/* Authentic Bio */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Personal portfolio of <strong className="text-white font-semibold">Nitesh Vishwakarma</strong>. Specializing in high-throughput backend services, strict relational persistence, and immersive modern web architectures.
            </p>

            {/* CTAs with Realistic Micro-interactions & Official Social Links */}
            <div className="flex flex-col gap-5 pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.98]"
                >
                  <span>Explore Projects</span>
                  <Sparkles className="w-4 h-4 ml-2 text-slate-950 transition-transform group-hover:rotate-12" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-md shadow-lg shadow-black/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.98]"
                >
                  <span>Get in Touch</span>
                </a>
              </div>

              {/* Official Social Links (GitHub, LinkedIn, Instagram, Email) */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mr-1">Connect:</span>
                <SocialLinks />
              </div>
            </div>

            {/* Verified Meta Specs */}
            <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified: @niteshvishwakarma-dev</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>FastAPI + PostgreSQL Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D Composition with Real Photo */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Embedded Interactive Three.js 3D Canvas Background in Hero */}
            <div className="absolute -inset-10 sm:-inset-14 z-0 opacity-80 pointer-events-none">
              <Hero3DScene />
            </div>

            {/* Real Authentic Portrait Card with 3D Tilt & Glassmorphism (Permanently Locked to Original Photo) */}
            <TiltCard
              maxTilt={10}
              glowColor="rgba(6, 182, 212, 0.22)"
              className="relative z-10 w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] group"
            >
              <div className="w-full h-full relative">
                {/* Exact Original Photo - Permanently Locked */}
                <img
                  src={photoUrl}
                  alt="Nitesh Vishwakarma"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Restrained glass overlay at bottom to anchor text legibility */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent backdrop-blur-[2px] border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-0.5">
                        Verified Identity
                      </div>
                      <div className="text-base font-bold text-white tracking-tight">
                        Nitesh Vishwakarma
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        @niteshvishwakarma-dev
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* High-tech corner accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
              </div>
            </TiltCard>

            

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-14">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
