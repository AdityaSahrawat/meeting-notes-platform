import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base, SessionLocal
# Import models to register them with Base before metadata.create_all
from app.models import meeting, participant, transcript, action_item
from app.routers import meetings, transcripts, action_items, uploads


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ------------------------------------------------------------------
    # Startup
    # ------------------------------------------------------------------
    # 1. Create all tables (no-op if they already exist)
    Base.metadata.create_all(bind=engine)

    # 2. Ensure uploads directory exists
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    # 3. Seed a demo meeting if the database is empty
    try:
        from app.database.seed import seed_if_empty
        db = SessionLocal()
        try:
            seed_if_empty(db)
        finally:
            db.close()
    except Exception as e:
        print(f"[startup] Seed failed (non-fatal): {e}")

    yield
    # ------------------------------------------------------------------
    # Shutdown (nothing to clean up)
    # ------------------------------------------------------------------


app = FastAPI(
    title="Meeting Notes Platform API",
    description="Backend service for managing meeting notes, participants, transcripts, and action items",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration — allow all origins (frontend on Vercel + local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)
app.include_router(uploads.router)


@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "meeting-notes-platform-api"
    }
