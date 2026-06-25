from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.transcript import TranscriptSegmentCreate, TranscriptSegmentUpdate, TranscriptSegmentResponse
from app.services import transcript_service
from typing import List, Optional

router = APIRouter()

@router.get("/meetings/{meeting_id}/transcript", response_model=List[TranscriptSegmentResponse], tags=["Transcripts"])
def get_transcript(
    meeting_id: int,
    search: Optional[str] = Query(None, description="Search term to filter transcript content"),
    db: Session = Depends(get_db)
):
    return transcript_service.get_transcript_segments(db, meeting_id, search)

@router.post("/meetings/{meeting_id}/transcript", response_model=List[TranscriptSegmentResponse], tags=["Transcripts"])
def upload_transcript(
    meeting_id: int,
    segments: List[TranscriptSegmentCreate],
    db: Session = Depends(get_db)
):
    return transcript_service.create_transcript_segments(db, meeting_id, segments)

@router.put("/transcript/{segment_id}", response_model=TranscriptSegmentResponse, tags=["Transcripts"])
def update_transcript_segment(
    segment_id: int,
    segment_data: TranscriptSegmentUpdate,
    db: Session = Depends(get_db)
):
    return transcript_service.update_transcript_segment(db, segment_id, segment_data)

@router.delete("/transcript/{segment_id}", tags=["Transcripts"])
def delete_transcript_segment(
    segment_id: int,
    db: Session = Depends(get_db)
):
    return transcript_service.delete_transcript_segment(db, segment_id)
