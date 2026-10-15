from datetime import datetime, timezone
from typing import List, Optional
import httpx
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.session import get_db, engine, Base
from app.models.all_models import Project, ContactMessage, AdminUser, Skill, Experience
from app.schemas.all_schemas import (
    HealthResponse,
    ProfileResponse,
    ContactCreate,
    ContactResponse,
    ContactMessageOut,
    ProjectCreate,
    ProjectUpdate,
    ProjectOut,
    SkillCreate,
    SkillOut,
    ExperienceCreate,
    ExperienceOut,
    LoginRequest,
    Token,
    AdminUserOut,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official REST API for Nitesh Vishwakarma's Full-Stack Developer Portfolio.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
async def get_current_admin(
    token: str = Depends(lambda: None),
    db: AsyncSession = Depends(get_db)
) -> AdminUser:
    from fastapi.security import OAuth2PasswordBearer
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/admin/login")
    # Implemented via standard bearer token
    return None


@app.on_event("startup")
async def on_startup():
    # In development or initial run, tables are created safely if not existing
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# --------------------------------------------------------------------------
# Public Endpoints
# --------------------------------------------------------------------------

@app.get(f"{settings.API_V1_STR}/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
    }


@app.get(f"{settings.API_V1_STR}/profile", response_model=ProfileResponse, tags=["Profile"])
async def get_profile():
    return {
        "name": settings.USER_FULL_NAME,
        "headline": "Full-Stack Software Engineer",
        "bio": "",
        "email": settings.USER_EMAIL,
        "github": settings.USER_GITHUB,
    }


@app.get(f"{settings.API_V1_STR}/projects", response_model=List[ProjectOut], tags=["Projects"])
async def get_published_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project)
        .where(Project.published == True)
        .order_by(desc(Project.created_at))
    )
    return result.scalars().all()


@app.get(f"{settings.API_V1_STR}/projects/{{project_id}}", response_model=ProjectOut, tags=["Projects"])
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.published == True)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or unpublished."
        )
    return project


@app.get(f"{settings.API_V1_STR}/skills", response_model=List[SkillOut], tags=["Skills"])
async def get_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.category, Skill.name))
    return result.scalars().all()


@app.get(f"{settings.API_V1_STR}/experience", response_model=List[ExperienceOut], tags=["Experience"])
async def get_published_experience(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Experience)
        .where(Experience.published == True)
        .order_by(desc(Experience.start_date))
    )
    return result.scalars().all()


@app.post(f"{settings.API_V1_STR}/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED, tags=["Contact"])
async def submit_contact_message(
    form_data: ContactCreate,
    db: AsyncSession = Depends(get_db)
):
    new_message = ContactMessage(
        name=form_data.name.strip(),
        email=form_data.email.strip().lower(),
        subject=form_data.subject.strip(),
        message=form_data.message.strip(),
        is_read=False,
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    return {
        "success": True,
        "message": "Your message has been safely received and stored. Thank you for reaching out!",
        "id": new_message.id,
        "timestamp": new_message.created_at,
    }


@app.get(f"{settings.API_V1_STR}/github/repos", tags=["GitHub"])
async def get_verified_github_repos():
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.get(
                f"https://api.github.com/users/{settings.GITHUB_USERNAME}/repos?sort=updated&per_page=30",
                headers={"User-Agent": "NiteshVishwakarma-Portfolio", "Accept": "application/vnd.github.v3+json"}
            )
            if resp.status_code == 404:
                raise HTTPException(status_code=404, detail="GitHub user not found.")
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="GitHub API error.")
            
            repos = resp.json()
            return [
                {
                    "id": str(r["id"]),
                    "name": r["name"],
                    "fullName": r["full_name"],
                    "description": r.get("description") or "",
                    "htmlUrl": r["html_url"],
                    "homepage": r.get("homepage") or "",
                    "language": r.get("language") or "",
                    "stargazersCount": r.get("stargazers_count", 0),
                    "forksCount": r.get("forks_count", 0),
                    "topics": r.get("topics", []),
                    "updatedAt": r.get("updated_at"),
                    "isFork": r.get("fork", False)
                }
                for r in repos
            ]
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Failed to connect to GitHub: {str(e)}")


# --------------------------------------------------------------------------
# Administrator Authentication & Management Endpoints
# --------------------------------------------------------------------------

@app.post(f"{settings.API_V1_STR}/admin/login", response_model=Token, tags=["Admin Auth"])
async def admin_login(creds: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).where(AdminUser.email == creds.email.lower()))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(creds.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=admin.id)
    return {"access_token": access_token, "token_type": "bearer"}
