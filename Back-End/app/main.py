from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import chatbot, patient

app = FastAPI(
    title="Alzheimer's Care Companion API",
    version="0.1.0",
    description="A simple chatbot API for Alzheimer's patients"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["chatbot"])
app.include_router(patient.router, prefix="/api/v1/patient", tags=["patient"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Alzheimer's Care Companion API",
        "version": "0.1.0",
        "docs_url": "/docs"
    } 