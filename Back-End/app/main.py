from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, caregiver, chatbot
from app.database.database import engine
from app.database.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost",
    "https://alzheimers-care-companion.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["authentication"]
)

app.include_router(
    caregiver.router,
    prefix=f"{settings.API_V1_STR}/caregiver",
    tags=["caregiver"]
)

app.include_router(
    chatbot.router,
    prefix=f"{settings.API_V1_STR}/chatbot",
    tags=["chatbot"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Alzheimer's Care Companion API",
        "version": settings.VERSION,
        "docs_url": "/docs"
    } 