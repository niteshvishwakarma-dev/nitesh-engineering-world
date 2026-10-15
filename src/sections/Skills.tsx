import React from 'react';
import { Layers, Terminal, Sparkles } from 'lucide-react';
import { Skill } from '../types';
import { TiltCard } from '../components/TiltCard';

interface SkillsProps {
  skills: Skill[];
  onOpenAdmin: () => void;
}

export const Skills: React.FC<SkillsProps> = ({ skills, onOpenAdmin }) => {
  const categories: Array<'Languages' | 'Frameworks' | 'Databases' | 'DevOps & Tools' | 'Core'> = [
    'Languages',
    'Frameworks',
    'Databases',
    'DevOps & Tools',
    'Core',
  ];

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  const hasAnySkills = skills.length > 0;

  return (
    <section id="skills" className="py-28 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-3">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Skills & Competencies
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Admin-managed inventory. Showing only verified proficiencies.
          </p>
        </div>

        {!hasAnySkills ? (
          /* Graceful Empty State */
          <div className="border border-dashed border-slate-800 rounded-3xl p-12 sm:p-14 text-center bg-slate-900/40 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Skills inventory will appear here when configured.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              In accordance with no-demo-data principles, only technologies explicitly recorded by the administrator are rendered.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-cyan-500/40 transition-all"
            >
              Configure in Admin Portal
            </button>
          </div>
        ) : (
          /* Categorized Skills Grid - 3D TiltCards with Zero-Pill Typography */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const items = grouped[cat] || [];
              if (items.length === 0) return null;

              return (
                <TiltCard
                  key={cat}
                  maxTilt={6}
                  glowColor="rgba(56, 189, 248, 0.15)"
                  className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 pb-2 border-b border-slate-800">
                      {cat}
                    </h3>

                    {/* Unboxed items separated by dots */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-200">
                      {items.map((skill, index) => (
                        <React.Fragment key={skill.id}>
                          <span className="hover:text-cyan-300 transition-colors font-medium">
                            {skill.name}
                          </span>
                          {index < items.length - 1 && (
                            <span aria-hidden="true" className="text-slate-600 font-mono">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    {items.length} verified item{items.length !== 1 ? 's' : ''}
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
