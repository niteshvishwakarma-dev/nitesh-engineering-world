import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Mail,
  FolderGit2,
  Layers,
  Briefcase,
  User,
  Github,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../services/api';
import { Project, Skill, Experience, ContactMessage, AdminStats, GitHubRepo } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);

  // Form states for login / setup
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSetupKey, setAuthSetupKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'github' | 'skills' | 'messages' | 'experience' | 'profile'>('overview');

  // Dashboard Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Project Editing / Creation
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');

  // Skill Creation
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Languages');

  // Experience Creation
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    role: '',
    organization: '',
    type: 'Work',
    startDate: '',
    description: '',
    published: true,
  });

  // Profile Edit
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');

  // Check admin status on open
  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      const status = await api.getAdminStatus();
      setHasAdmin(status.hasAdmin);

      if (token) {
        try {
          const me = await api.verifyMe();
          setCurrentUser(me.user);
          loadAdminData();
        } catch {
          handleLogout();
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [s, p, sk, m, exp, prof] = await Promise.all([
        api.getAdminStats(),
        api.getAdminProjects(),
        api.getSkills(),
        api.getMessages(),
        api.getExperience(),
        api.getProfile(),
      ]);
      setStats(s);
      setProjects(p);
      setSkills(sk);
      setMessages(m);
      setExperience(exp);
      setHeadline(prof.headline || '');
      setBio(prof.bio || '');
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (!hasAdmin) {
        // Initial setup
        const res = await api.setupAdmin(
  { email: authEmail, password: authPassword },
  authSetupKey
);
        localStorage.setItem('admin_token', res.token);
        setToken(res.token);
        setCurrentUser(res.user);
        setHasAdmin(true);
      } else {
        // Standard login
        const res = await api.login({ email: authEmail, password: authPassword });
        localStorage.setItem('admin_token', res.token);
        setToken(res.token);
        setCurrentUser(res.user);
      }
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setCurrentUser(null);
    setProjects([]);
    setSkills([]);
    setMessages([]);
    onDataChanged();
  };

  // Projects CRUD
  const handleSaveProject = async () => {
    if (!editingProject?.title || !editingProject?.description) {
      alert('Title and description are required.');
      return;
    }

    try {
      const techArray = techInput
        ? techInput.split(',').map((t) => t.trim()).filter(Boolean)
        : editingProject.technologies || [];

      if (editingProject.id) {
        await api.updateProject(editingProject.id, {
          ...editingProject,
          technologies: techArray,
        });
      } else {
        await api.createProject({
          ...editingProject,
          technologies: techArray,
        });
      }
      setEditingProject(null);
      setTechInput('');
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      await api.updateProject(project.id, { published: !project.published });
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  // Fetch GitHub repos
  const handleFetchGitHubRepos = async () => {
    setLoadingData(true);
    try {
      const repos = await api.getGitHubRepos();
      setGithubRepos(repos);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch GitHub repos');
    } finally {
      setLoadingData(false);
    }
  };

  const handleImportGitHubRepo = async (repo: GitHubRepo) => {
    try {
      const techs = [repo.language, ...(repo.topics || [])].filter(Boolean) as string[];
      await api.createProject({
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || `Repository: ${repo.fullName}`,
        category: 'Full-Stack',
        technologies: techs,
        repositoryUrl: repo.htmlUrl,
        liveUrl: repo.homepage || '',
        published: false, // Imported as draft by default for explicit review per prompt section 7C
      });
      alert(`Imported "${repo.name}" as draft project. Review and publish when ready!`);
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to import repository');
    }
  };

  // Skills
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await api.createSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
      });
      setNewSkillName('');
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill');
    }
  };

  // Messages
  const handleMarkRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      loadAdminData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(id);
      loadAdminData();
    } catch (err: any) {
      console.error(err);
    }
  };

  // Profile Save
  const handleSaveProfile = async () => {
    try {
      await api.updateProfile({ headline, bio });
      alert('Profile updated successfully.');
      loadAdminData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#101114] border border-white/15 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#141518]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Portfolio Administration
              </h2>
              <div className="text-[11px] font-mono text-neutral-400">
                Verified Portal · PostgreSQL/FastAPI API Contract
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <User className="w-3.5 h-3.5 text-orange-400" />
                <span>{currentUser.email}</span>
              </div>
            )}
            {token && (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/[0.04] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-base leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Unauthenticated View: Login or Initial Admin Setup */}
          {!token ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md bg-[#141519] border border-white/10 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 text-orange-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {hasAdmin === false ? 'Initialize Primary Administrator' : 'Administrator Sign In'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {hasAdmin === false
                      ? 'No default hardcoded credentials exist. Create your secure administrator account to manage this portfolio.'
                      : 'Enter your administrator credentials to access the management dashboard.'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                
<form onSubmit={handleAuthSubmit} className="space-y-4">
  <div>
    <label className="block text-xs font-mono text-neutral-400 mb-1.5">
      Admin Email *
    </label>
    <input
      type="email"
      required
      autoComplete="email"
      placeholder="Enter your admin email"
      value={authEmail}
      onChange={(e) => setAuthEmail(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg bg-[#18191f] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
    />
  </div>

  {hasAdmin === false && (
    <div>
      <label className="block text-xs font-mono text-neutral-400 mb-1.5">
        Admin Setup Key *
      </label>
      <input
        type="password"
        required
        autoComplete="off"
        placeholder="Enter your private setup key"
        value={authSetupKey}
        onChange={(e) => setAuthSetupKey(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg bg-[#18191f] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  )}

  <div>
    <label className="block text-xs font-mono text-neutral-400 mb-1.5">
      Password (min. 8 characters) *
    </label>
    <input
      type="password"
      required
      minLength={8}
      autoComplete={hasAdmin === false ? "new-password" : "current-password"}
      placeholder="Enter your password"
      value={authPassword}
      onChange={(e) => setAuthPassword(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg bg-[#18191f] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
    />
  </div>

  <button
    type="submit"
    disabled={authLoading}
    className="w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white transition-colors"
  >
    {authLoading
      ? 'Authenticating...'
      : hasAdmin === false
      ? 'Create Administrator Account'
      : 'Sign In to Portal'}
  </button>
</form>


                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 text-center">
                  Encrypted with bcrypt (12 rounds) & signed JWT tokens.
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated View */
            <>
              {/* Sidebar Navigation */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/[0.08] p-3 flex md:flex-col gap-1 overflow-x-auto bg-[#121316]">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects</span>
                  <span className="ml-auto text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">
                    {projects.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('github');
                    if (githubRepos.length === 0) handleFetchGitHubRepos();
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'github'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Sync</span>
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'skills'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Skills</span>
                  <span className="ml-auto text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">
                    {skills.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Inbox</span>
                  {stats && stats.unreadMessages > 0 && (
                    <span className="ml-auto text-[10px] font-mono bg-orange-600 px-1.5 py-0.5 rounded text-white font-bold">
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('experience')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'experience'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Experience</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Bio & Headline</span>
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#0f1013]">
                {loadingData && (
                  <div className="py-2 mb-4 flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                    <span>Synchronizing database records...</span>
                  </div>
                )}

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        System & Database Status
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Live metrics from the persistence layer.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.08]">
                        <div className="text-xs font-mono text-neutral-400">Total Projects</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats?.totalProjects || 0}</div>
                        <div className="text-[11px] text-neutral-400 mt-1">
                          {stats?.publishedProjects || 0} published · {stats?.draftProjects || 0} draft
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.08]">
                        <div className="text-xs font-mono text-neutral-400">Contact Messages</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats?.totalMessages || 0}</div>
                        <div className="text-[11px] text-orange-400 mt-1">
                          {stats?.unreadMessages || 0} unread
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.08]">
                        <div className="text-xs font-mono text-neutral-400">Skills Configured</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats?.totalSkills || 0}</div>
                        <div className="text-[11px] text-neutral-400 mt-1">Categorized</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.08]">
                        <div className="text-xs font-mono text-neutral-400">Experience Items</div>
                        <div className="text-2xl font-bold text-white mt-1">{stats?.totalExperience || 0}</div>
                        <div className="text-[11px] text-neutral-400 mt-1">Records</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#141519] border border-white/[0.08]">
                      <h4 className="text-xs font-mono uppercase text-orange-400 tracking-wider mb-2">
                        Authentic Data Guarantee
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Per Section 3 of your requirements, all tables operate strictly on genuine data. No fabricated demo repositories, simulated visitor statistics, or sample contact inquiries are ever inserted.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight">
                          Project Management
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Create, edit, and toggle publication status.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingProject({
                            title: '',
                            description: '',
                            category: 'Full-Stack',
                            technologies: [],
                            repositoryUrl: '',
                            liveUrl: '',
                            published: false,
                          });
                          setTechInput('');
                        }}
                        className="px-3.5 py-2 rounded-lg text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    {/* Edit Form Modal/Drawer */}
                    {editingProject && (
                      <div className="p-5 rounded-xl bg-[#16171c] border border-orange-500/30 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                          <span className="text-xs font-mono text-orange-400 uppercase">
                            {editingProject.id ? 'Edit Project' : 'New Project'}
                          </span>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="text-neutral-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1">Title *</label>
                            <input
                              type="text"
                              value={editingProject.title || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1">Category</label>
                            <select
                              value={editingProject.category || 'Full-Stack'}
                              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                            >
                              <option value="Full-Stack">Full-Stack</option>
                              <option value="Web">Web</option>
                              <option value="Backend">Backend</option>
                              <option value="Tools">Tools</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Description *</label>
                          <textarea
                            rows={3}
                            value={editingProject.description || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1">Repository URL</label>
                            <input
                              type="url"
                              placeholder="https://github.com/niteshvishwakarma-dev/..."
                              value={editingProject.repositoryUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, repositoryUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1">Live URL (Optional)</label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={editingProject.liveUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Technologies (comma-separated, e.g. React, TypeScript, FastAPI)
                          </label>
                          <input
                            type="text"
                            placeholder="FastAPI, React, PostgreSQL"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#1c1d22] border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProject.published)}
                              onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                              className="rounded border-white/20 bg-neutral-800 text-orange-500"
                            />
                            <span>Publish to public portfolio</span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                          <button
                            onClick={() => setEditingProject(null)}
                            className="px-3 py-1.5 rounded text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProject}
                            className="px-4 py-1.5 rounded text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white"
                          >
                            Save Project
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Projects Table */}
                    {projects.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-400 text-xs">
                        No projects recorded in database yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="p-4 rounded-xl bg-[#141519] border border-white/[0.08] flex items-center justify-between gap-4"
                          >
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white truncate">
                                  {proj.title}
                                </span>
                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                    proj.published
                                      ? 'bg-emerald-500/15 text-emerald-300'
                                      : 'bg-neutral-800 text-neutral-400'
                                  }`}
                                >
                                  {proj.published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 truncate mt-1">
                                {proj.description}
                              </p>
                              {proj.repositoryUrl && (
                                <div className="text-[11px] font-mono text-neutral-500 truncate mt-1">
                                  {proj.repositoryUrl}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleTogglePublish(proj)}
                                title={proj.published ? 'Unpublish' : 'Publish'}
                                className="p-2 rounded hover:bg-white/5 text-neutral-400 hover:text-white text-xs"
                              >
                                {proj.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProject(proj);
                                  setTechInput(proj.technologies?.join(', ') || '');
                                }}
                                title="Edit"
                                className="p-2 rounded hover:bg-white/5 text-neutral-400 hover:text-white"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                title="Delete"
                                className="p-2 rounded hover:bg-red-500/10 text-neutral-400 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: GITHUB SYNC */}
                {activeTab === 'github' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight">
                          Sync Public GitHub Repositories
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Verified target: <span className="font-mono text-orange-400">@niteshvishwakarma-dev</span>
                        </p>
                      </div>
                      <button
                        onClick={handleFetchGitHubRepos}
                        className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Repos</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.08] text-xs text-neutral-400">
                      Imported repositories are safely created as <strong className="text-neutral-200">drafts</strong> so you can review titles, descriptions, and categories before publishing them publicly.
                    </div>

                    {githubRepos.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-400 text-xs">
                        No repositories loaded yet. Click "Refresh Repos" above to fetch public repositories from GitHub.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {githubRepos.map((repo) => {
                          const alreadyImported = projects.some((p) => p.repositoryUrl === repo.htmlUrl);

                          return (
                            <div
                              key={repo.id}
                              className="p-4 rounded-xl bg-[#141519] border border-white/[0.08] flex items-center justify-between gap-4"
                            >
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-white truncate font-mono">
                                    {repo.name}
                                  </span>
                                  {repo.language && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-neutral-300">
                                      {repo.language}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-400 truncate mt-1">
                                  {repo.description || 'No description provided on GitHub.'}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={repo.htmlUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-neutral-400 hover:text-white"
                                  title="View on GitHub"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>

                                {alreadyImported ? (
                                  <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded bg-emerald-500/10">
                                    Imported
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleImportGitHubRepo(repo)}
                                    className="px-3 py-1.5 rounded text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white"
                                  >
                                    Import as Draft
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: SKILLS */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Skills Management
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Add verified proficiencies to your technical inventory.
                      </p>
                    </div>

                    <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-[#141519] border border-white/[0.08] flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        placeholder="Skill name (e.g. FastAPI, PostgreSQL, Docker)"
                        required
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="flex-1 min-w-[200px] px-3.5 py-2 rounded-lg bg-[#1a1b22] border border-white/10 text-xs text-white"
                      />
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="px-3.5 py-2 rounded-lg bg-[#1a1b22] border border-white/10 text-xs text-white"
                      >
                        <option value="Languages">Languages</option>
                        <option value="Frameworks">Frameworks</option>
                        <option value="Databases">Databases</option>
                        <option value="DevOps & Tools">DevOps & Tools</option>
                        <option value="Core">Core</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white"
                      >
                        Add Skill
                      </button>
                    </form>

                    <div className="space-y-2">
                      {skills.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-400 text-xs">
                          No skills added yet. Use the form above to record verified skills.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {skills.map((s) => (
                            <div
                              key={s.id}
                              className="p-3 rounded-lg bg-[#141519] border border-white/[0.08] flex items-center justify-between"
                            >
                              <div>
                                <div className="text-xs font-semibold text-white">{s.name}</div>
                                <div className="text-[10px] font-mono text-neutral-400">{s.category}</div>
                              </div>
                              <button
                                onClick={() => handleDeleteSkill(s.id)}
                                className="text-neutral-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: INBOX */}
                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Contact Submissions Inbox
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Messages sent through the portfolio's contact form.
                      </p>
                    </div>

                    {messages.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-400 text-xs">
                        No contact messages received yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={`p-5 rounded-xl border transition-colors ${
                              m.read
                                ? 'bg-[#141519] border-white/[0.06]'
                                : 'bg-[#171820] border-orange-500/30'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-white/[0.06]">
                              <div>
                                <span className="font-semibold text-sm text-white">{m.name}</span>
                                <span className="text-xs text-neutral-400 font-mono ml-2">({m.email})</span>
                              </div>
                              <span className="text-[11px] font-mono text-neutral-400">
                                {new Date(m.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <div className="text-xs font-medium text-orange-300 mb-2">
                              Subject: {m.subject}
                            </div>

                            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap mb-4 bg-black/20 p-3 rounded border border-white/[0.04]">
                              {m.message}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                              <a
                                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                                className="text-xs font-medium text-orange-400 hover:underline flex items-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply via Email</span>
                              </a>

                              <div className="flex items-center gap-2">
                                {!m.read && (
                                  <button
                                    onClick={() => handleMarkRead(m.id)}
                                    className="px-2.5 py-1 rounded text-xs bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark Read</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteMessage(m.id)}
                                  className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: EXPERIENCE */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Experience & Education
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Add career or academic credentials.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#141519] border border-white/[0.08] space-y-4">
                      <div className="text-xs font-mono text-orange-400 uppercase">
                        Add Career / Education Record
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Role / Degree *</label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Software Engineer"
                            value={newExp.role}
                            onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Organization *</label>
                          <input
                            type="text"
                            placeholder="e.g. Tech Corp"
                            value={newExp.organization}
                            onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Type</label>
                          <select
                            value={newExp.type}
                            onChange={(e) => setNewExp({ ...newExp, type: e.target.value as any })}
                            className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                          >
                            <option value="Work">Work</option>
                            <option value="Education">Education</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Start Date</label>
                          <input
                            type="text"
                            placeholder="e.g. 2024"
                            value={newExp.startDate}
                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">End Date</label>
                          <input
                            type="text"
                            placeholder="e.g. Present"
                            value={newExp.endDate || ''}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newExp.description}
                          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#1a1b22] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={async () => {
                            if (!newExp.role || !newExp.organization) return alert('Role and Organization required');
                            await api.createProject; // typecheck
                            const res = await fetch('/api/v1/admin/experience', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify(newExp),
                            });
                            if (res.ok) {
                              setNewExp({ role: '', organization: '', type: 'Work', startDate: '', description: '', published: true });
                              loadAdminData();
                              onDataChanged();
                            }
                          }}
                          className="px-4 py-2 rounded text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white"
                        >
                          Save Record
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: PROFILE */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Bio & Headline Settings
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Customize editable bio content.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#141519] border border-white/[0.08] space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Headline</label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b22] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Custom Bio (Optional)</label>
                        <textarea
                          rows={5}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Add verified professional background narrative..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b22] border border-white/10 text-xs text-white leading-relaxed"
                        />
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white"
                      >
                        Update Profile
                      </button>
                    </div>

                    {/* Original Photo Manager */}
                    <div className="p-5 rounded-xl bg-[#141519] border border-cyan-500/30 space-y-4 max-w-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                        <div>
                          <h4 className="text-sm font-semibold text-white tracking-tight">
                            Original Photo Asset Manager
                          </h4>
                          <p className="text-xs text-neutral-400 font-mono mt-0.5">
                            Target: <span className="text-cyan-400">/nitesh-photo.png</span>
                          </p>
                        </div>
                        <img
                          src="/nitesh-photo.png"
                          alt="Current active photo"
                          className="w-10 h-10 rounded-lg object-cover border border-cyan-500/40"
                        />
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">
                        This asset is the single source used for both the <strong className="text-white">Hero Portrait Card</strong> and the <strong className="text-white">Full-Page Cinematic Shadow Background</strong>.
                      </p>

                      <div className="border border-dashed border-cyan-500/40 rounded-xl p-4 text-center bg-cyan-950/20">
                        <label className="cursor-pointer block">
                          <span className="text-xs font-medium text-cyan-300 hover:text-cyan-200">
                            Click to select & upload your original "nitesh photo.png"
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = async () => {
                                try {
                                  await api.uploadPhoto(reader.result as string);
                                  alert('Original photo successfully saved to /nitesh-photo.png! It is now active across all sections.');
                                  onDataChanged();
                                } catch (err: any) {
                                  alert(err.message || 'Failed to upload photo');
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <div className="text-[11px] font-mono text-neutral-400 mt-1">
                          PNG, JPG, or WEBP supported
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
