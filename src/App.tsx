import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { WhatsAppBadge } from './components/WhatsAppBadge';
import { AdminDashboard } from './sections/AdminDashboard';
import { BackgroundCosmos } from './components/canvas/BackgroundCosmos';
import { BackgroundPortrait } from './components/BackgroundPortrait';
import { api } from './services/api';
import { Profile, Project, Skill, Experience as ExperienceType } from './types';

export default function App() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [photoUrl, setPhotoUrl] = useState('/nitesh-photo.png');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check if admin is currently authenticated
  const checkAdminAuth = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }
    try {
      await api.verifyMe();
      setIsAdminLoggedIn(true);
    } catch {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('admin_token');
    }
  }, []);

  // Load public portfolio data
  const loadPortfolioData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, projData, skillsData, expData] = await Promise.all([
        api.getProfile().catch(() => ({
          name: 'Nitesh Vishwakarma',
          headline: 'Full-Stack Software Engineer',
          bio: '',
          email: 'niteshvishwakarma7267980881@gmail.com',
          github: 'https://github.com/niteshvishwakarma-dev',
        })),
        api.getProjects().catch(() => []),
        api.getSkills().catch(() => []),
        api.getExperience().catch(() => []),
      ]);

      setProfile(profData);
      setProjects(projData);
      setSkills(skillsData);
      setExperience(expData);
    } catch (err: any) {
      console.error('Error loading portfolio data:', err);
      setError(err.message || 'Failed to connect to portfolio API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolioData();
    checkAdminAuth();

    // Keyboard shortcut: Ctrl+Shift+A opens admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadPortfolioData, checkAdminAuth]);

  return (
    <div className="min-h-screen bg-[#06080d] text-[#f1f5f9] flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200 relative">
      {/* Interactive 3D Cosmic Background */}
      <BackgroundCosmos />

      {/* Persistent Full-Page Cinematic Background Portrait */}
      <BackgroundPortrait photoUrl={photoUrl} />

      {/* Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        <Hero
          photoUrl={photoUrl}
          onPhotoUpdated={(newUrl) => setPhotoUrl(newUrl)}
        />
        <About profile={profile} />
        <Projects
          projects={projects}
          loading={loading}
          error={error}
          onRefresh={loadPortfolioData}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <Skills
          skills={skills}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <Experience experience={experience} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating WhatsApp Contact Badge */}
      <WhatsAppBadge />

      {/* Administrator Management Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          checkAdminAuth();
        }}
        onDataChanged={() => {
          loadPortfolioData();
          checkAdminAuth();
        }}
      />
    </div>
  );
}
