import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime, ARRAY, JSON
from app.db.session import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Full-Stack", nullable=False, index=True)
    technologies = Column(JSON, default=list, nullable=False)
    repository_url = Column(String(500), default="", nullable=False)
    live_url = Column(String(500), default="", nullable=False)
    cover_image = Column(String(500), default="", nullable=False)
    published = Column(Boolean, default=False, nullable=False, index=True)
    featured = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(50), nullable=False, default="Core", index=True)
    proficiency = Column(String(50), nullable=False, default="Intermediate")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    role = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False, default="Work")  # Work or Education
    location = Column(String(255), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True)
    is_current = Column(Boolean, default=False, nullable=False)
    description = Column(Text, default="", nullable=False)
    published = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
