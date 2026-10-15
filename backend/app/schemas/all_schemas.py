from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, HttpUrl


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    service: str
    version: str
    database: str


class ProfileResponse(BaseModel):
    name: str
    headline: str
    bio: str
    email: EmailStr
    github: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: str
    timestamp: datetime


class ContactMessageOut(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    category: str = "Full-Stack"
    technologies: List[str] = []
    repository_url: str = ""
    live_url: str = ""
    cover_image: str = ""
    published: bool = False
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[List[str]] = None
    repository_url: Optional[str] = None
    live_url: Optional[str] = None
    cover_image: Optional[str] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None


class ProjectOut(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = "Core"
    proficiency: str = "Intermediate"


class SkillOut(BaseModel):
    id: str
    name: str
    category: str
    proficiency: str
    created_at: datetime

    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    role: str
    organization: str
    type: str = "Work"
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: str = ""
    published: bool = False


class ExperienceOut(ExperienceCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserOut(BaseModel):
    id: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
