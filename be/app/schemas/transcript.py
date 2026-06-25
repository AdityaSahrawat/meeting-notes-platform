from pydantic import BaseModel, ConfigDict
from typing import Optional

class TranscriptSegmentBase(BaseModel):
    speaker: str
    timestamp_seconds: int
    content: str

class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass

class TranscriptSegmentUpdate(BaseModel):
    speaker: Optional[str] = None
    timestamp_seconds: Optional[int] = None
    content: Optional[str] = None

class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int

    model_config = ConfigDict(from_attributes=True)
