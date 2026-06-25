from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
# Import models to register them with Base before metadata.create_all
from app.models import meeting, participant, transcript, action_item
from app.routers import meetings, transcripts, action_items

# Create database tables dynamically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meeting Notes Platform API",
    description="Backend service for managing meeting notes, participants, transcripts, and action items",
    version="1.0.0"
)

# CORS configuration to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "meeting-notes-platform-api"
    }
