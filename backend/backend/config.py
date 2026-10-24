import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the backend package
BASE_DIR = Path(__file__).resolve().parent

# Load .env file if it exists
load_dotenv(BASE_DIR / ".env")

class Config:
    """Base application configuration."""
    ENVIRONMENT = os.environ.get("FLASK_ENV", "development")
    _secret = os.environ.get("SECRET_KEY")
    if not _secret:
        if ENVIRONMENT == "production":
            raise RuntimeError("CRITICAL SECURITY ERROR: SECRET_KEY environment variable must be set in production mode.")
        _secret = "dev-insecure-secret-key-must-set-in-prod-roadtruth"
    SECRET_KEY = _secret

    # Official role registration code to prevent unauthorized users from claiming official privileges
    OFFICIAL_INVITE_CODE = os.environ.get("OFFICIAL_INVITE_CODE", "ROADTRUTH_OFFICIAL_AUTH_2026")

    # Auth token validity in seconds (default: 24 hours)
    TOKEN_EXPIRATION_SECONDS = int(os.environ.get("TOKEN_EXPIRATION_SECONDS", 86400))
    
    # SQLite Database configuration
    INSTANCE_DIR = BASE_DIR / "instance"
    INSTANCE_DIR.mkdir(parents=True, exist_ok=True)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{INSTANCE_DIR / 'roadtruth.sqlite3'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurable CORS origins for React frontend (Vite & Create-React-App dev ports)
    CORS_ALLOWED_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173"
        ).split(",")
        if origin.strip()
    ]

    # JSON configuration
    JSON_SORT_KEYS = False

