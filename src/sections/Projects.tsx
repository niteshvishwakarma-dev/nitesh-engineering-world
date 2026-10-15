import React, { useState } from 'react';
import { ExternalLink, Github, FolderGit2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { TiltCard } from '../components/TiltCard';

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenAdmin: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  loading,
  error,
  onRefresh,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const categories = ['all', 'Full-Stack', 'Web', 'Backend', 'Tools'];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <section id="projects" className="py-28 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-3">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Engineered Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Project Showcase
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Authentic software projects backed by genuine repository sources and live deployments.
            </p>
          </div>

          {/* Interactive Filter Segmented Control */}
          {projects.length > 0 && (
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md overflow-x-auto shadow-inner">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Projects' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-400">Querying project database records...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800/50 text-slate-300 flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-200">Unable to load project data</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
              <button
                onClick={onRefresh}
                className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-700/60 transition-colors"
              >
                Retry Query
              </button>
            </div>
          </div>
        )}

        {/* Clean Honest Empty State (Strictly NO fake demo projects) */}
        {!loading && !error && projects.length === 0 && (
          <div className="border border-dashed border-slate-800 rounded-3xl p-12 sm:p-16 text-center bg-slate-900/30 backdrop-blur-md shadow-2xl relative overflow-hidden group">
            {/* Ambient accent glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-indigo-500/5 to-transparent pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-center mx-auto mb-5 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
              Projects will appear here when added.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-7 leading-relaxed">
              In accordance with authentic portfolio standards, no fabricated demo repositories or mock projects are pre-loaded. Connect to the admin portal or sync live repositories directly from GitHub.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
              <button
                onClick={onOpenAdmin}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
              >
                Open Admin Portal
              </button>
              <a
                href="https://github.com/niteshvishwakarma-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 hover:border-slate-500 bg-slate-800/40 text-slate-300 hover:text-white transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Visit GitHub Profile</span>
              </a>
            </div>
          </div>
        )}

        {/* 3D Perspective Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <TiltCard
                key={project.id}
                maxTilt={8}
                glowColor="rgba(56, 189, 248, 0.2)"
                className="rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl hover:shadow-[0_0_35px_rgba(6,182,212,0.18)] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Optional Cover Image */}
                {project.coverImage ? (
                  <div className="aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
                    <span className="text-cyan-400 font-semibold">{project.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies: unboxed text with dots */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-mono flex flex-wrap items-center gap-x-2 gap-y-1 mb-5">
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span className="text-slate-300">{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-slate-600">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Repository"
                          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Live Site"
                          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProjectModal(project)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  {activeProjectModal.category}
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {activeProjectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
              {activeProjectModal.description}
            </p>

            {activeProjectModal.technologies && activeProjectModal.technologies.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-2">Technologies Used</div>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-200">
                  {activeProjectModal.technologies.map((t, idx) => (
                    <span key={t}>
                      {t}{idx < activeProjectModal.technologies.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              {activeProjectModal.repositoryUrl && (
                <a
                  href={activeProjectModal.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 hover:border-slate-500 text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </a>
              )}
              {activeProjectModal.liveUrl && (
                <a
                  href={activeProjectModal.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-md shadow-cyan-950/40 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Live</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
