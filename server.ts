import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface PortfolioDatabase {
  profile: {
    name: string;
    headline: string;
    bio: string;
    email: string;
    github: string;
  };
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  messages: ContactMessage[];
  admins: AdminUser[];
}

// Initial clean database state: strictly verified personal information only, no demo data
const getInitialDatabase = (): PortfolioDatabase => ({
  profile: {
    name: 'Nitesh Vishwakarma',
    headline: 'Full-Stack Software Engineer',
    bio: '', // Empty until configured
    email: 'niteshvishwakarma7267980881@gmail.com',
    github: 'https://github.com/niteshvishwakarma-dev',
  },
  projects: [], // Clean honest empty state: no fabricated projects
  skills: [], // Admin-managed skills
  experience: [], // Clean honest empty state: no invented history
  messages: [], // Real contact submissions only
  admins: [], // Configured via secure initial setup
});

function loadDatabase(): PortfolioDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, resetting to initial state:', err);
    const initial = getInitialDatabase();
    return initial;
  }
}

function saveDatabase(db: PortfolioDatabase): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple in-memory rate limiter for contact form and login
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
      });
    }

    entry.count += 1;
    next();
  };
}

// Middleware: Authenticate Admin JWT
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/* ==========================================================================
   PUBLIC API ENDPOINTS (/api/v1)
   ========================================================================== */

// 1. Health Check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Nitesh Vishwakarma Portfolio API',
    version: '1.0.0',
    database: 'active',
  });
});

// 2. Profile Details
app.get('/api/v1/profile', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.profile);
});

// 3. Projects (Public - Only published projects)
app.get('/api/v1/projects', (_req: Request, res: Response) => {
  const db = loadDatabase();
  const publishedProjects = db.projects.filter((p) => p.published);
  res.json(publishedProjects);
});

// 4. Single Project (Public)
app.get('/api/v1/projects/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const project = db.projects.find((p) => p.id === req.params.id && p.published);
  if (!project) {
    return res.status(404).json({ error: 'Project not found or not published.' });
  }
  res.json(project);
});

// 5. Skills (Public)
app.get('/api/v1/skills', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.skills || []);
});

// 6. Experience (Public - Only published)
app.get('/api/v1/experience', (_req: Request, res: Response) => {
  const db = loadDatabase();
  const publishedExp = (db.experience || []).filter((e) => e.published);
  res.json(publishedExp);
});

// 7. Contact Form Submission (Real persistence with server-side validation)
app.post(
  '/api/v1/contact',
  rateLimiter(5, 60 * 1000), // Max 5 submissions per minute per IP
  (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'A valid name with at least 2 characters is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      return res.status(400).json({ error: 'Subject must be at least 2 characters.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }

    const db = loadDatabase();
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    db.messages.unshift(newMessage);
    saveDatabase(db);

    return res.status(201).json({
      success: true,
      message: 'Your message has been safely received and stored. Thank you for reaching out!',
      id: newMessage.id,
      timestamp: newMessage.createdAt,
    });
  }
);

// 8. GitHub Public Repositories Proxy (Verified username only)
app.get('/api/v1/github/repos', async (_req: Request, res: Response) => {
  const username = 'niteshvishwakarma-dev';
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers: {
        'User-Agent': 'NiteshVishwakarma-Portfolio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: `GitHub user @${username} not found.` });
      }
      return res.status(response.status).json({
        error: `GitHub API error: ${response.statusText}`,
      });
    }

    const repos = await response.json();
    const sanitized = Array.isArray(repos)
      ? repos.map((repo: any) => ({
          id: String(repo.id),
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || '',
          htmlUrl: repo.html_url,
          homepage: repo.homepage || '',
          language: repo.language || '',
          stargazersCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          topics: repo.topics || [],
          updatedAt: repo.updated_at,
          isFork: repo.fork,
        }))
      : [];

    res.json(sanitized);
  } catch (err: any) {
    console.error('GitHub fetch failed:', err);
    res.status(502).json({ error: 'Failed to connect to GitHub API.' });
  }
});

/* ==========================================================================
   ADMIN AUTH & PROTECTED ENDPOINTS (/api/v1/admin/*)
   ========================================================================== */

// Admin Status: Check if an admin account already exists
app.get('/api/v1/admin/status', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    hasAdmin: db.admins.length > 0,
    adminCount: db.admins.length,
  });
});

// Admin Initial Setup (Only allowed if 0 admins exist)
app.post('/api/v1/admin/setup', async (req: Request, res: Response) => {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  const providedKey = req.get('x-admin-setup-key');

  if (!setupKey || !providedKey || providedKey !== setupKey) {
    return res.status(403).json({
      error: 'Admin setup is not authorized.',
    });
  }

  const db = loadDatabase();
  if (db.admins.length > 0) {
    return res.status(403).json({
      error: 'Administrator already configured. Please use the login screen.',
    });
  }

  const { email, password } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newAdmin: AdminUser = {
    id: `admin_${Date.now()}`,
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.admins.push(newAdmin);
  saveDatabase(db);

  const token = jwt.sign({ id: newAdmin.id, email: newAdmin.email }, JWT_SECRET, {
    expiresIn: '24h',
  });

  res.status(201).json({
    success: true,
    message: 'Admin account initialized successfully.',
    token,
    user: { id: newAdmin.id, email: newAdmin.email },
  });
});

// Admin Login
app.post(
  '/api/v1/admin/login',
  rateLimiter(5, 60 * 1000), // Max 5 login attempts per minute
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = loadDatabase();
    const admin = db.admins.find((a) => a.email === email.trim().toLowerCase());

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      success: true,
      token,
      user: { id: admin.id, email: admin.email },
    });
  }
);

// Admin Verify Token
app.get('/api/v1/admin/me', authenticateAdmin, (req: Request, res: Response) => {
  res.json({
    user: (req as any).admin,
  });
});

// Admin Stats
app.get('/api/v1/admin/stats', authenticateAdmin, (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    totalProjects: db.projects.length,
    publishedProjects: db.projects.filter((p) => p.published).length,
    draftProjects: db.projects.filter((p) => !p.published).length,
    totalMessages: db.messages.length,
    unreadMessages: db.messages.filter((m) => !m.read).length,
    totalSkills: db.skills.length,
    totalExperience: db.experience.length,
  });
});

// Admin Profile Update
app.patch('/api/v1/admin/profile', authenticateAdmin, (req: Request, res: Response) => {
  const { headline, bio } = req.body;
  const db = loadDatabase();

  if (headline !== undefined) db.profile.headline = String(headline).trim();
  if (bio !== undefined) db.profile.bio = String(bio).trim();

  saveDatabase(db);
  res.json({ success: true, profile: db.profile });
});

// Photo Upload (Direct & Admin): Saves the exact uploaded photograph directly to public/nitesh-photo.png
const handlePhotoSave = (req: Request, res: Response) => {
  const { imageBase64 } = req.body;
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Base64 image data is required.' });
  }

  try {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const publicTarget = path.resolve(process.cwd(), 'public', 'nitesh-photo.png');
    const assetsTarget = path.resolve(process.cwd(), 'src', 'assets', 'nitesh-photo.png');
    const distTarget = path.resolve(process.cwd(), 'dist', 'nitesh-photo.png');

    fs.writeFileSync(publicTarget, buffer);
    if (fs.existsSync(path.dirname(assetsTarget))) {
      fs.writeFileSync(assetsTarget, buffer);
    }
    if (fs.existsSync(path.dirname(distTarget))) {
      fs.writeFileSync(distTarget, buffer);
    }

    return res.json({
      success: true,
      message: 'Original photo successfully updated across all website sections.',
      assetPath: '/nitesh-photo.png?t=' + Date.now(),
    });
  } catch (err: any) {
    console.error('Error saving uploaded photo:', err);
    return res.status(500).json({ error: 'Failed to write photo file to disk.' });
  }
};

// Public photo upload disabled for security.
app.post('/api/v1/admin/upload-photo', authenticateAdmin, handlePhotoSave);

// Admin Projects Management
app.get('/api/v1/admin/projects', authenticateAdmin, (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.projects);
});

app.post('/api/v1/admin/projects', authenticateAdmin, (req: Request, res: Response) => {
  const { title, description, technologies, category, repositoryUrl, liveUrl, coverImage, published, featured } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Project title is required.' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Project description is required.' });
  }

  const db = loadDatabase();
  const now = new Date().toISOString();

  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim(),
    description: description.trim(),
    technologies: Array.isArray(technologies) ? technologies.map(t => String(t).trim()).filter(Boolean) : [],
    category: category ? String(category).trim() : 'Full-Stack',
    repositoryUrl: repositoryUrl ? String(repositoryUrl).trim() : '',
    liveUrl: liveUrl ? String(liveUrl).trim() : '',
    coverImage: coverImage ? String(coverImage).trim() : '',
    published: Boolean(published),
    featured: Boolean(featured),
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(newProject);
  saveDatabase(db);

  res.status(201).json(newProject);
});

app.patch('/api/v1/admin/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.projects.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const existing = db.projects[index];
  const { title, description, technologies, category, repositoryUrl, liveUrl, coverImage, published, featured } = req.body;

  const updated: Project = {
    ...existing,
    title: title !== undefined ? String(title).trim() : existing.title,
    description: description !== undefined ? String(description).trim() : existing.description,
    technologies: Array.isArray(technologies) ? technologies.map(t => String(t).trim()).filter(Boolean) : existing.technologies,
    category: category !== undefined ? String(category).trim() : existing.category,
    repositoryUrl: repositoryUrl !== undefined ? String(repositoryUrl).trim() : existing.repositoryUrl,
    liveUrl: liveUrl !== undefined ? String(liveUrl).trim() : existing.liveUrl,
    coverImage: coverImage !== undefined ? String(coverImage).trim() : existing.coverImage,
    published: published !== undefined ? Boolean(published) : existing.published,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updated;
  saveDatabase(db);

  res.json(updated);
});

app.delete('/api/v1/admin/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== req.params.id);

  if (db.projects.length === initialLength) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Project deleted successfully.' });
});

// Admin Skills Management
app.post('/api/v1/admin/skills', authenticateAdmin, (req: Request, res: Response) => {
  const { name, category, proficiency } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Skill name is required.' });
  }

  const db = loadDatabase();
  const newSkill: Skill = {
    id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    category: category || 'Core',
    proficiency: proficiency || 'Intermediate',
    createdAt: new Date().toISOString(),
  };

  db.skills.push(newSkill);
  saveDatabase(db);

  res.status(201).json(newSkill);
});

app.delete('/api/v1/admin/skills/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.skills = db.skills.filter((s) => s.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Admin Experience Management
app.get('/api/v1/admin/experience', authenticateAdmin, (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.experience || []);
});

app.post('/api/v1/admin/experience', authenticateAdmin, (req: Request, res: Response) => {
  const { role, organization, type, location, startDate, endDate, current, description, published } = req.body;

  if (!role || !organization) {
    return res.status(400).json({ error: 'Role and organization are required.' });
  }

  const db = loadDatabase();
  const newExp: Experience = {
    id: `exp_${Date.now()}`,
    role: String(role).trim(),
    organization: String(organization).trim(),
    type: type === 'Education' ? 'Education' : 'Work',
    location: location ? String(location).trim() : undefined,
    startDate: startDate || new Date().toISOString().slice(0, 7),
    endDate: current ? undefined : endDate,
    current: Boolean(current),
    description: description ? String(description).trim() : '',
    published: Boolean(published),
    createdAt: new Date().toISOString(),
  };

  db.experience.unshift(newExp);
  saveDatabase(db);
  res.status(201).json(newExp);
});

app.delete('/api/v1/admin/experience/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.experience = db.experience.filter((e) => e.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Admin Contact Messages Management
app.get('/api/v1/admin/messages', authenticateAdmin, (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.messages);
});

app.patch('/api/v1/admin/messages/:id/read', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const msg = db.messages.find((m) => m.id === req.params.id);
  if (!msg) {
    return res.status(404).json({ error: 'Message not found.' });
  }
  msg.read = true;
  saveDatabase(db);
  res.json(msg);
});

app.delete('/api/v1/admin/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.messages = db.messages.filter((m) => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

/* ==========================================================================
   VITE DEV MIDDLEWARE & STATIC SERVING
   ========================================================================== */

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Full-Stack Server] API v1 available at http://0.0.0.0:${PORT}/api/v1`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
