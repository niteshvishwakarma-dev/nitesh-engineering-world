import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experience: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  // If no verified entries, section cleanly omits rendering per prompt section 3 & 7D
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 border-t border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        <div className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">
            Background & Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f3f4f6]">
            Experience & Education
          </h2>
        </div>

        <div className="space-y-6">
          {experience.map((item) => (
            <div
              key={item.id}
              className="bg-[#121316] border border-white/[0.08] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-orange-400 shrink-0 mt-0.5">
                  {item.type === 'Education' ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <Briefcase className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {item.role}
                  </h3>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {item.organization} {item.location ? `· ${item.location}` : ''}
                  </div>
                  {item.description && (
                    <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs text-neutral-400 font-mono whitespace-nowrap self-start md:self-auto">
                {item.startDate} — {item.current ? 'Present' : item.endDate || ''}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
