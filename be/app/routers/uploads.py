import os
import shutil
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.meeting import Meeting

router = APIRouter()

# Base directory for video uploads (relative to project root, lives next to app/)
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")


def ensure_uploads_dir():
    os.makedirs(UPLOADS_DIR, exist_ok=True)


@router.post("/meetings/{meeting_id}/video", tags=["Video"])
async def upload_video(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Receive an MP4 upload from the frontend and store it on the server filesystem."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    ensure_uploads_dir()

    # Only accept video files
    if file.content_type and not file.content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected a video file, received: {file.content_type}"
        )

    dest_path = os.path.join(UPLOADS_DIR, f"{meeting_id}.mp4")

    try:
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    finally:
        await file.close()

    # Persist path on meeting row
    meeting.video_path = dest_path
    db.commit()

    return {"detail": "Video uploaded successfully", "meeting_id": meeting_id}


@router.get("/meetings/{meeting_id}/video", tags=["Video"])
def serve_video(meeting_id: int, db: Session = Depends(get_db)):
    """Stream the stored MP4 back to the client."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    # For seeded meetings the video lives in seed_data/, for uploaded ones in uploads/
    video_path = meeting.video_path
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video file not found on server")

    return FileResponse(
        path=video_path,
        media_type="video/mp4",
        filename=f"meeting_{meeting_id}.mp4",
        headers={"Accept-Ranges": "bytes"}
    )
