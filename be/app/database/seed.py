"""
Smart seed script.

If the meetings table is EMPTY on startup, this seeds one demo meeting by:
  1. Parsing be/seed_data/transcript.txt (3-line format: timestamp → speaker → content per block)
  2. Creating participant rows for every unique speaker
  3. Creating the meeting row
  4. Copying be/seed_data/sample.mp4 → be/uploads/<id>.mp4 and saving video_path
  5. Creating TranscriptSegment rows
  6. Calling the Gemini LLM pipeline to generate llm_summary

If the table already has rows, the seed is skipped silently.
"""

import sys
import os
import shutil
from datetime import datetime, timezone

# Allow running as a standalone script (python seed.py) and as an import
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.database.db import engine, Base, SessionLocal
from app.models import meeting as meeting_module, participant as participant_module, transcript as transcript_module, action_item as action_item_module
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.transcript import TranscriptSegment

# Paths
_BE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SEED_DATA_DIR = os.path.join(_BE_DIR, "seed_data")
SAMPLE_MP4 = os.path.join(SEED_DATA_DIR, "sample.mp4")
SAMPLE_TRANSCRIPT = os.path.join(SEED_DATA_DIR, "transcript.txt")
UPLOADS_DIR = os.path.join(_BE_DIR, "uploads")


def _parse_transcript(path: str) -> list[dict]:
    """Parse the 3-line-per-block transcript format into segment dicts."""
    with open(path, "r", encoding="utf-8") as f:
        lines = [l.rstrip() for l in f.readlines()]

    # Filter blank lines into chunks of 3
    non_blank = [l for l in lines if l.strip()]
    segments = []
    i = 0
    while i + 2 < len(non_blank):
        raw_ts = non_blank[i].replace("[", "").replace("]", "").strip()
        speaker = non_blank[i + 1].strip()
        content = non_blank[i + 2].strip()
        i += 3

        # Convert HH:MM:SS or MM:SS to seconds
        parts = raw_ts.split(":")
        try:
            if len(parts) == 3:
                seconds = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
            elif len(parts) == 2:
                seconds = int(parts[0]) * 60 + int(parts[1])
            else:
                seconds = int(raw_ts)
        except ValueError:
            seconds = 0

        segments.append({"speaker": speaker, "timestamp_seconds": seconds, "content": content})

    return segments


def seed_if_empty(db: Session | None = None):
    """Seed the database with one demo meeting if the meetings table is empty."""
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        count = db.query(Meeting).count()
        if count > 0:
            print(f"[seed] DB already has {count} meeting(s), skipping seed.")
            return

        # Validate seed data files
        if not os.path.exists(SAMPLE_TRANSCRIPT):
            print(f"[seed] WARNING: {SAMPLE_TRANSCRIPT} not found. Skipping seed.")
            return

        print("[seed] Empty database detected — seeding demo meeting...")

        # 1. Parse transcript
        segments = _parse_transcript(SAMPLE_TRANSCRIPT)
        if not segments:
            print("[seed] WARNING: transcript.txt parsed 0 segments. Skipping seed.")
            return

        # 2. Create / find participants
        speaker_names = list(dict.fromkeys(s["speaker"] for s in segments))  # ordered unique
        participant_ids = []
        for name in speaker_names:
            existing = db.query(Participant).filter(Participant.name.ilike(name)).first()
            if existing:
                participant_ids.append(existing.id)
            else:
                p = Participant(name=name)
                db.add(p)
                db.flush()
                participant_ids.append(p.id)

        participants = db.query(Participant).filter(Participant.id.in_(participant_ids)).all()

        # 3. Compute duration from last segment
        duration = (segments[-1]["timestamp_seconds"] + 30) if segments else 1800

        # 4. Create meeting row
        demo_meeting = Meeting(
            title="Demo Meeting — Fireflies Platform Overview",
            meeting_date=datetime(2024, 8, 8, 10, 0, 0, tzinfo=timezone.utc),
            duration_seconds=duration,
            summary="A demo meeting showing platform capabilities including transcript search, AI summaries, and action item management.",
            participants=participants,
            is_seeded=True,
        )
        db.add(demo_meeting)
        db.flush()  # get the ID

        # 5. Copy sample.mp4 → uploads/<id>.mp4
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        if os.path.exists(SAMPLE_MP4):
            dest = os.path.join(UPLOADS_DIR, f"{demo_meeting.id}.mp4")
            shutil.copy2(SAMPLE_MP4, dest)
            demo_meeting.video_path = dest
            print(f"[seed] Copied sample.mp4 → {dest}")
        else:
            print(f"[seed] NOTE: {SAMPLE_MP4} not found. Meeting seeded without video.")

        # 6. Create transcript segments
        for seg in segments:
            db.add(TranscriptSegment(
                meeting_id=demo_meeting.id,
                speaker_name=seg["speaker"],
                timestamp_seconds=seg["timestamp_seconds"],
                content=seg["content"],
            ))

        # 7. Generate AI summary via Gemini LLM pipeline
        try:
            from app.services.transcript_service import generate_summary_with_gemini
            transcript_text = "\n".join(f"{s['speaker']}: {s['content']}" for s in segments)
            print("[seed] Calling Gemini for AI summary...")
            llm_summary = generate_summary_with_gemini(transcript_text)
            demo_meeting.llm_summary = llm_summary
            print("[seed] AI summary generated successfully.")
        except Exception as e:
            print(f"[seed] WARNING: Gemini call failed: {e}. llm_summary left as None.")

        db.commit()
        print(f"[seed] Demo meeting seeded with ID={demo_meeting.id}, {len(segments)} transcript segments.")

    finally:
        if close_db:
            db.close()


# ---------------------------------------------------------------------------
# Allow running directly: python seed.py
# This will DROP + RECREATE tables then seed the demo meeting.
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("Dropping all tables to ensure database is empty...")
    Base.metadata.drop_all(bind=engine)
    print("Recreating all tables (blank database)...")
    Base.metadata.create_all(bind=engine)
    print("Database is now clean and empty — running seed...")
    seed_if_empty()
