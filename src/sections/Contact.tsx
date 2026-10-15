import React, { useState } from 'react';
import { Mail, Github, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { TiltCard } from '../components/TiltCard';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ id: string; timestamp: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) return;

    if (formData.name.trim().length < 2) {
      setErrorMessage('Please provide your name (at least 2 characters).');
      setStatus('error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }
    if (formData.subject.trim().length < 2) {
      setErrorMessage('Subject must be at least 2 characters.');
      setStatus('error');
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage('Please write a message with at least 10 characters.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await api.sendContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setStatus('success');
      setSuccessInfo({ id: res.id, timestamp: res.timestamp });
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-28 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono uppercase tracking-widest text-cyan-400 mb-3">
                <MessageSquare className="w-3 h-3 text-cyan-400" />
                <span>Direct Communications</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Let's build something exceptional.
              </h2>
              
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Initiate a conversation regarding technical architecture, full-stack systems engineering, or collaborative opportunities. Submissions are persisted to the database and delivered directly to Nitesh Vishwakarma.
              </p>

              {/* Direct Channels with 3D Tilt */}
              <div className="space-y-4">
                <TiltCard
                  maxTilt={5}
                  glowColor="rgba(56, 189, 248, 0.15)"
                  className="rounded-2xl overflow-hidden"
                >
                  <a
                    href="mailto:niteshvishwakarma7267980881@gmail.com"
                    className="flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl backdrop-blur-xl text-slate-300 hover:text-white transition-all group block"
                  >
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-mono text-cyan-400">Direct Email</div>
                      <div className="text-sm font-semibold truncate text-white group-hover:text-cyan-300 transition-colors">
                        niteshvishwakarma7267980881@gmail.com
                      </div>
                    </div>
                  </a>
                </TiltCard>

                <TiltCard
                  maxTilt={5}
                  glowColor="rgba(168, 85, 247, 0.15)"
                  className="rounded-2xl overflow-hidden"
                >
                  <a
                    href="https://github.com/niteshvishwakarma-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl backdrop-blur-xl text-slate-300 hover:text-white transition-all group block"
                  >
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-purple-400">GitHub Profile</div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        github.com/niteshvishwakarma-dev
                      </div>
                    </div>
                  </a>
                </TiltCard>
              </div>
            </div>

            <div className="pt-8 text-xs text-slate-500 font-mono">
              Database persistence verified · Rate-limited API protection
            </div>
          </div>

          {/* Form Column with 3D Glass Surface */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              
              {status === 'success' ? (
                <div className="py-8 text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    Message Safely Stored in Database
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                    Thank you for reaching out. Your transmission has been confirmed by the backend server and will be reviewed shortly.
                  </p>
                  {successInfo && (
                    <div className="text-[11px] font-mono text-cyan-400 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 mb-6 shadow-inner">
                      Stored Reference ID: {successInfo.id}
                    </div>
                  )}
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 hover:border-cyan-500/40 text-white transition-colors"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    All fields validated server-side.
                  </p>

                  {status === 'error' && errorMessage && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="e.g. Maya Lin"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="e.g. maya@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5">
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="e.g. Software Architecture Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Describe your technical requirements, architecture scope, or role specifications..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all active:scale-95 disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Persisting Transmission...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
