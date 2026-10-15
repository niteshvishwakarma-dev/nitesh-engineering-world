"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # admin_users
    op.create_table(
        'admin_users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_admin_users_email', 'admin_users', ['email'])

    # projects
    op.create_table(
        'projects',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False, default='Full-Stack'),
        sa.Column('technologies', sa.JSON(), nullable=False),
        sa.Column('repository_url', sa.String(length=500), nullable=False, default=''),
        sa.Column('live_url', sa.String(length=500), nullable=False, default=''),
        sa.Column('cover_image', sa.String(length=500), nullable=False, default=''),
        sa.Column('published', sa.Boolean(), nullable=False, default=False),
        sa.Column('featured', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_projects_published', 'projects', ['published'])
    op.create_index('ix_projects_category', 'projects', ['category'])

    # contact_messages
    op.create_table(
        'contact_messages',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_contact_messages_email', 'contact_messages', ['email'])
    op.create_index('ix_contact_messages_is_read', 'contact_messages', ['is_read'])

    # skills
    op.create_table(
        'skills',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False, unique=True),
        sa.Column('category', sa.String(length=50), nullable=False, default='Core'),
        sa.Column('proficiency', sa.String(length=50), nullable=False, default='Intermediate'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_skills_name', 'skills', ['name'])
    op.create_index('ix_skills_category', 'skills', ['category'])

    # experiences
    op.create_table(
        'experiences',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('role', sa.String(length=255), nullable=False),
        sa.Column('organization', sa.String(length=255), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False, default='Work'),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('start_date', sa.String(length=50), nullable=False),
        sa.Column('end_date', sa.String(length=50), nullable=True),
        sa.Column('is_current', sa.Boolean(), nullable=False, default=False),
        sa.Column('description', sa.Text(), nullable=False, default=''),
        sa.Column('published', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_experiences_published', 'experiences', ['published'])


def downgrade() -> None:
    op.drop_table('experiences')
    op.drop_table('skills')
    op.drop_table('contact_messages')
    op.drop_table('projects')
    op.drop_table('admin_users')
