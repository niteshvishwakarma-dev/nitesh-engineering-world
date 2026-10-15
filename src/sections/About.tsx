import React from 'react';
import { Code2, Database, ShieldCheck, Terminal, Cpu, ArrowUpRight } from 'lucide-react';
import { Profile } from '../types';
import { TiltCard } from '../components/TiltCard';

interface AboutProps {
  profile?: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const principles = [
    {
      icon: Code2,
      color: 'text-cyan-400',
      title: 'Type-Safe Full-Stack Systems',
      description: 'End-to-end type safety bridging strict React TypeScript frontends with typed Pydantic & SQLAlchemy 2.0 backend schemas.',
    },
    {
      icon: Database,
      color: 'text-sky-400',
      title: 'Persistent Relational Design',
      description: 'Disciplined PostgreSQL schemas, reproducible Alembic migration pipelines, and zero fabricated records.',
    },
    {
      icon: ShieldCheck,
      color: 'text-indigo-400',
      title: 'Stateless JWT & Hashed RBAC',
      description: 'Bcrypt-hashed credentials (12 rounds), signed short-lived JWT tokens, and strictly protected administrative endpoints.',
    },
    {
      icon: Cpu,
      color: 'text-purple-400',
      title: 'Interactive 3D Performance',
      description: 'Hardware-accelerated Three.js scenes, GPU shader optimization, and zero-compromise responsive frame rates.',
    },
  ];

  return (
    <section id="about" className="py-28 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-3">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Architecture & Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Architected for scale and clarity.
          </h2>
        </div>

        {/* Biography Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-center">
          <div className="lg:col-span-7 space-y-6 text-slate-300 font-normal leading-relaxed text-base sm:text-lg">
            <p>
              I am <strong className="text-white font-semibold">Nitesh Vishwakarma</strong>, a full-stack software engineer dedicated to crafting resilient, high-performance web systems and immersive digital experiences.
            </p>
            {profile?.bio ? (
              <p className="text-slate-200">{profile.bio}</p>
            ) : (
              <p>
                My development methodology unites modern React ecosystems with Python FastAPI and PostgreSQL backends. I prioritize defensive input validation, low-latency API contracts, and clean modular code structures that withstand production demands.
              </p>
            )}
            <p className="text-slate-400 text-sm">
              Every project and skill showcased on this platform is backed by authentic database persistence and verified GitHub repositories. No mock stubs, artificial testimonials, or simulated activity.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <TiltCard
              maxTilt={8}
              glowColor="rgba(6, 182, 212, 0.2)"
              className="w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] group"
            >
              <div className="w-full h-full relative">
                <img
                  src="/nitesh-photo.png"
                  alt="Nitesh Vishwakarma"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent backdrop-blur-[2px] border-t border-white/10">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-0.5">
                    Verified Engineer
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    Nitesh Vishwakarma
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Principles 3D Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item) => (
            <TiltCard
              key={item.title}
              maxTilt={6}
              glowColor="rgba(56, 189, 248, 0.12)"
              className="bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-lg transition-all duration-300"
            >
              <item.icon className={`w-6 h-6 ${item.color} mb-4`} />
              <h3 className="text-base font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
