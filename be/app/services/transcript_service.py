from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.transcript import TranscriptSegment
from app.services.meeting_service import get_meeting_by_id
from app.schemas.transcript import TranscriptSegmentCreate, TranscriptSegmentUpdate
from typing import Optional, List

def get_transcript_segments(db: Session, meeting_id: int, search: Optional[str] = None) -> List[TranscriptSegment]:
    # Ensure meeting exists
    get_meeting_by_id(db, meeting_id)

    query = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id)
    if search:
        query = query.filter(TranscriptSegment.content.ilike(f"%{search}%"))
    
    return query.order_by(TranscriptSegment.timestamp_seconds).all()

def create_transcript_segments(db: Session, meeting_id: int, segments: List[TranscriptSegmentCreate]) -> List[TranscriptSegment]:
    # Ensure meeting exists
    get_meeting_by_id(db, meeting_id)

    db_segments = []
    for segment in segments:
        db_seg = TranscriptSegment(
            meeting_id=meeting_id,
            speaker_name=segment.speaker,
            timestamp_seconds=segment.timestamp_seconds,
            content=segment.content
        )
        db.add(db_seg)
        db_segments.append(db_seg)
    
    db.commit()
    for db_seg in db_segments:
        db.refresh(db_seg)
    return db_segments

def update_transcript_segment(db: Session, segment_id: int, segment_data: TranscriptSegmentUpdate) -> TranscriptSegment:
    db_segment = db.query(TranscriptSegment).filter(TranscriptSegment.id == segment_id).first()
    if not db_segment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transcript segment with ID {segment_id} not found"
        )
    
    if segment_data.speaker is not None:
        db_segment.speaker_name = segment_data.speaker
    if segment_data.timestamp_seconds is not None:
        db_segment.timestamp_seconds = segment_data.timestamp_seconds
    if segment_data.content is not None:
        db_segment.content = segment_data.content
        
    db.commit()
    db.refresh(db_segment)
    return db_segment

def delete_transcript_segment(db: Session, segment_id: int) -> dict:
    db_segment = db.query(TranscriptSegment).filter(TranscriptSegment.id == segment_id).first()
    if not db_segment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transcript segment with ID {segment_id} not found"
        )
    db.delete(db_segment)
    db.commit()
    return {"detail": f"Transcript segment {segment_id} deleted successfully"}
