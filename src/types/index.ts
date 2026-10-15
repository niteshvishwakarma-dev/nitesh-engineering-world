export interface Profile {
  name: string;
  headline: string;
  bio: string;
  email: string;
  github: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  repositoryUrl: string;
  liveUrl?: string;
  coverImage?: string;
  published: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Languages' | 'Frameworks' | 'Databases' | 'DevOps & Tools' | 'Core';
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  type: 'Work' | 'Education';
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  published: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
  updatedAt: string;
  isFork: boolean;
}

export interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalSkills: number;
  totalExperience: number;
}
