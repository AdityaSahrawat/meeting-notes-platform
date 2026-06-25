from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    speaker_name = Column(String(100), nullable=False)
    timestamp_seconds = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)

    meeting = relationship("Meeting", back_populates="transcript")

    @property
    def speaker(self) -> str:
        return self.speaker_name

    @speaker.setter
    def speaker(self, value: str):
        self.speaker_name = value

