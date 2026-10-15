import { Profile, Project, Skill, Experience, ContactMessage, GitHubRepo, AdminStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const res = await fetch(`${API_BASE}/api/v1/health`);
    if (!res.ok) throw new Error('Failed to fetch API health');
    return res.json();
  },

  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/api/v1/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/api/v1/projects`);
    if (!res.ok) throw new Error('Failed to fetch published projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/api/v1/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async getSkills(): Promise<Skill[]> {
    const res = await fetch(`${API_BASE}/api/v1/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async getExperience(): Promise<Experience[]> {
    const res = await fetch(`${API_BASE}/api/v1/experience`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    return res.json();
  },

  async sendContact(data: { name: string; email: string; subject: string; message: string }): Promise<{
    success: boolean;
    message: string;
    id: string;
    timestamp: string;
  }> {
    const res = await fetch(`${API_BASE}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit contact message');
    }
    return result;
  },

  async getGitHubRepos(): Promise<GitHubRepo[]> {
    const res = await fetch(`${API_BASE}/api/v1/github/repos`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch GitHub repositories');
    }
    return res.json();
  },

  // Admin Authentication
  async getAdminStatus(): Promise<{ hasAdmin: boolean; adminCount: number }> {
    const res = await fetch(`${API_BASE}/api/v1/admin/status`);
    if (!res.ok) throw new Error('Failed to get admin status');
    return res.json();
  },

  async setupAdmin(
  data: { email: string; password: string },
  setupKey: string
): Promise<{ token: string; user: any }> {
  const res = await fetch(`${API_BASE}/api/v1/admin/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-setup-key': setupKey,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Admin setup failed');
  return result;
},
  async login(data: { email: string; password: string }): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/api/v1/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Invalid email or password');
    return result;
  },

  async verifyMe(): Promise<{ user: { id: string; email: string } }> {
    const res = await fetch(`${API_BASE}/api/v1/admin/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/api/v1/admin/stats`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  // Admin Projects CRUD
  async getAdminProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/projects`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin projects');
    return res.json();
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/api/v1/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create project');
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/api/v1/admin/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update project');
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // Admin Skills
  async createSkill(skill: { name: string; category: string; proficiency?: string }): Promise<Skill> {
    const res = await fetch(`${API_BASE}/api/v1/admin/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(skill),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create skill');
    return data;
  },

  async deleteSkill(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete skill');
  },

  // Admin Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/messages`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async markMessageRead(id: string): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/api/v1/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to update message');
    return res.json();
  },

  async deleteMessage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete message');
  },

  // Admin Profile Update
  async updateProfile(updates: { headline?: string; bio?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  async uploadPhoto(imageBase64: string): Promise<{ success: boolean; message: string; assetPath: string }> {
    const res = await fetch(`${API_BASE}/api/v1/admin/upload-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ imageBase64 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload photo');
    return data;
  },

  async uploadPhotoDirect(imageBase64: string): Promise<{ success: boolean; message: string; assetPath: string }> {
    const res = await fetch(`${API_BASE}/api/v1/upload-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload photo');
    return data;
  },
};
