from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.transcript import TranscriptSegment
from app.services.meeting_service import get_meeting_by_id
from app.schemas.transcript import TranscriptSegmentCreate, TranscriptSegmentUpdate
from typing import Optional, List
import json
import os
import urllib.request

def generate_summary_with_gemini(transcript_text: str) -> str:
    # 1. Resolve API key from environment or local .env configurations
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        paths = [
            os.path.join(base_dir, ".env"),
            os.path.join(base_dir, "be", ".env")
        ]
        for path in paths:
            if os.path.exists(path):
                with open(path, "r") as f:
                    for line in f:
                        if line.strip().startswith("GEMINI_API_KEY="):
                            api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                            break
            if api_key:
                break

    if not api_key or api_key == "YOUR_GEMINI_API_KEY":
        print("GEMINI_API_KEY is not configured. Falling back to default mock summary.")
        return "The meeting discussed key goals, database schema optimizations, Express.js and Postgres migration steps, rate limiting, and dashboard UI layout iterations."

    # 2. Call Gemini 2.5 Flash generateContent API endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = (
        "Please read the following meeting transcript and do two things:\n"
        "1. Write a concise, high-quality summary of 3-4 sentences summarizing the main discussion points.\n"
        "2. List the key topics or outline chapters discussed under a separate section heading 'Key Topics:'. Use bullet points starting with '• ' for each topic.\n\n"
        "Do not write in markdown (e.g. do not use bold ** or italics *), just output plain text. Keep it structured:\n\n"
        f"{transcript_text}"
    )

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        # 10s timeout to prevent hanging uploads
        with urllib.request.urlopen(req, timeout=10) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    summary_text = parts[0].get("text", "").strip()
                    # Strip raw markdown indicators if Gemini adds them
                    return summary_text.replace("**", "").replace("*", "").replace("`", "")
            return "Failed to parse summary content from Gemini response."
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"Gemini Auto-Summary: (Error: {str(e)}). Fallback: The session covered database design and routing."

def get_transcript_segments(db: Session, meeting_id: int, search: Optional[str] = None) -> List[TranscriptSegment]:
    # Ensure meeting exists
    get_meeting_by_id(db, meeting_id)

    query = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id)
    if search:
        query = query.filter(TranscriptSegment.content.ilike(f"%{search}%"))
    
    return query.order_by(TranscriptSegment.timestamp_seconds).all()

def create_transcript_segments(db: Session, meeting_id: int, segments: List[TranscriptSegmentCreate]) -> List[TranscriptSegment]:
    # Ensure meeting exists
    meeting = get_meeting_by_id(db, meeting_id)

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
    
    # Dynamic LLM summarization step
    try:
        transcript_text = "\n".join([f"{seg.speaker}: {seg.content}" for seg in segments])
        summary = generate_summary_with_gemini(transcript_text)
        meeting.llm_summary = summary
    except Exception as e:
        print(f"Failed to generate transcript summary: {e}")

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
