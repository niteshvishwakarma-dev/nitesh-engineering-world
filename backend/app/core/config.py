from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nitesh Vishwakarma Portfolio API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Verified personal information
    USER_FULL_NAME: str = "Nitesh Vishwakarma"
    USER_EMAIL: str = "niteshvishwakarma7267980881@gmail.com"
    USER_GITHUB: str = "https://github.com/niteshvishwakarma-dev"
    GITHUB_USERNAME: str = "niteshvishwakarma-dev"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio_db"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/portfolio_db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ais-dev-iwqnc6melncwawaec7riqi-340066104083.asia-southeast1.run.app",
        "https://ais-pre-iwqnc6melncwawaec7riqi-340066104083.asia-southeast1.run.app"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
