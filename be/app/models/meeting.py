from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from app.database.db import Base

meeting_participants = Table(
    "meeting_participants",
    Base.metadata,
    Column("meeting_id", Integer, ForeignKey("meetings.id", ondelete="CASCADE"), primary_key=True),
    Column("participant_id", Integer, ForeignKey("participants.id", ondelete="CASCADE"), primary_key=True),
)

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    llm_summary = Column(Text, nullable=True)
    duration_seconds = Column(Integer, nullable=False)
    meeting_date = Column(DateTime, nullable=False)
    video_path = Column(String(500), nullable=True)  # server-side path to the MP4 file
    is_seeded = Column(Boolean, default=False, nullable=False)  # True if this row was auto-seeded

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    participants = relationship("Participant", secondary=meeting_participants, back_populates="meetings")
    transcript = relationship("TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
