# Nitesh Vishwakarma — Full-Stack Developer Portfolio

A production-ready personal developer portfolio built with React, TypeScript, Vite, Tailwind CSS, Python FastAPI, SQLAlchemy 2.x, Alembic, and PostgreSQL.

---

## 1. Verified Personal Information

- **Full Name**: Nitesh Vishwakarma
- **GitHub**: [github.com/niteshvishwakarma-dev](https://github.com/niteshvishwakarma-dev)
- **Primary Contact**: [niteshvishwakarma7267980881@gmail.com](mailto:niteshvishwakarma7267980881@gmail.com)
- **Portrait**: High-resolution cinematic portrait with subtle studio lighting, grayscale filtering, and dark gradient transition.

> **Zero Fabricated Data Guarantee**: This application operates strictly on genuine, verified data. All project records, skill proficiencies, and contact messages persist to real database storage. Empty states are displayed honestly until verified content is added or imported.

---

## 2. Architecture & Project Layout

```
├── .env.example              # Environment variables template (no secrets)
├── server.ts                 # Full-stack server running Express + Vite integration
├── package.json              # Frontend & full-stack dependencies and scripts
├── backend/                  # Production Python FastAPI backend suite
│   ├── app/
│   │   ├── main.py           # FastAPI application, CORS, routers & startup hooks
│   │   ├── core/             # Configuration & bcrypt/JWT security modules
│   │   ├── models/           # SQLAlchemy 2.0 ORM models (projects, skills, messages, etc.)
│   │   ├── schemas/          # Pydantic v2 validation models
│   │   └── db/               # Async engine & session dependencies
│   ├── alembic/              # Alembic database migration scripts
│   ├── alembic.ini           # Alembic environment config
│   ├── tests/                # Pytest integration & endpoint validation tests
│   └── requirements.txt      # Python dependencies
├── src/
│   ├── components/           # Reusable UI components (Navbar, Footer, etc.)
│   ├── sections/             # Core sections (Hero, About, Projects, Skills, Contact, Admin)
│   ├── services/             # Typed API client for /api/v1 endpoints
│   ├── types/                # TypeScript interfaces
│   └── App.tsx               # Root React application
└── public/
    └── nitesh-portrait.jpg   # High-resolution portrait asset
```

---

## 3. Key Features

- **Cinematic Editorial Design**: Near-black palette (`#0b0c0e`), charcoal surfaces, off-white typography, and restrained burnt ember accents (`#ea580c`).
- **Zero-Pill Discipline**: Metadata displayed as clean, unboxed typography with typographic separators (`·`), without pill badge clutter.
- **Real Persistent Contact Form**: Server-side validation, rate-limiting protection, anti-bot honeypot, and database storage with reference IDs.
- **Secure Admin Portal**:
  - Encrypted password hashing with bcrypt (12 rounds) and signed JWT token authentication.
  - No hardcoded passwords or default accounts. On first run, a secure setup wizard allows the owner to initialize their credentials.
  - Project management: create, edit, toggle published status, and delete.
  - **One-Click GitHub Sync**: Securely fetches public repositories from `github.com/niteshvishwakarma-dev`, imports them as drafts for review, and retains genuine repository and live URLs.
  - Contact inbox: read, inspect, and reply to real visitor inquiries.
  - Skills & Experience management.

---

## 4. API Specification (/api/v1)

### Public Endpoints
- `GET /api/v1/health` — Health check & database connection status.
- `GET /api/v1/profile` — Verified developer profile.
- `GET /api/v1/projects` — Published portfolio projects.
- `GET /api/v1/projects/:id` — Single project details.
- `GET /api/v1/skills` — Categorized technical skills.
- `GET /api/v1/experience` — Verified career and education credentials.
- `POST /api/v1/contact` — Validates and persists contact messages.
- `GET /api/v1/github/repos` — Verified GitHub repository proxy for `@niteshvishwakarma-dev`.

### Protected Admin Endpoints
- `GET /api/v1/admin/status` — Checks if admin account exists.
- `POST /api/v1/admin/setup` — Initial administrator setup.
- `POST /api/v1/admin/login` — Authenticates admin and returns JWT token.
- `GET /api/v1/admin/me` — Verifies current JWT session.
- `GET /api/v1/admin/stats` — Live metrics (projects, unread messages, skills).
- `GET /api/v1/admin/projects` — All projects (including drafts).
- `POST /api/v1/admin/projects` — Creates a new project.
- `PATCH /api/v1/admin/projects/:id` — Updates project fields or toggles publication.
- `DELETE /api/v1/admin/projects/:id` — Removes project.
- `GET /api/v1/admin/messages` — Contact submissions inbox.
- `PATCH /api/v1/admin/messages/:id/read` — Marks message as read.
- `DELETE /api/v1/admin/messages/:id` — Deletes message.
- `POST /api/v1/admin/skills` — Adds technical skill.
- `DELETE /api/v1/admin/skills/:id` — Deletes skill.

---

## 5. Deployment Guide (Free-Tier Compatible)

### Option A: Railway / Render (Full-Stack Python + PostgreSQL)
1. **Database**: Create a free PostgreSQL instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Copy the connection string to `DATABASE_URL`.
3. Run Alembic migrations:
   ```bash
   cd backend
   pip install -r requirements.txt
   alembic upgrade head
   ```
4. Start FastAPI:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
5. Deploy Frontend to Vercel / Netlify / Cloudflare Pages with `VITE_API_BASE_URL` pointing to the backend.

### Option B: Unified Container (Cloud Run / Docker)
Run the application via Docker or Node.js runtime:
```bash
npm install
npm run build
npm start
```

---

## 6. Security Architecture

1. **Password Hashing**: Bcrypt with work factor 12.
2. **Stateless Tokens**: HMAC-SHA256 JWT tokens with 24-hour expiration.
3. **No Secret Leaks**: All secrets configured strictly through environment variables.
4. **Input Sanitation**: Rigorous schema validation on all incoming payload strings.
5. **No Blind Fallbacks**: Failures produce explicit errors rather than masking issues with fabricated data.
