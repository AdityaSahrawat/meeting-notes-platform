from datetime import datetime
from pydantic import BaseModel, ConfigDict, BeforeValidator
from typing_extensions import Annotated
from typing import Optional, List
from app.schemas.transcript import TranscriptSegmentResponse
from app.schemas.action_item import ActionItemResponse

class ParticipantShortResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class MeetingBase(BaseModel):
    title: str
    duration_seconds: int
    summary: Optional[str] = None

class MeetingCreate(MeetingBase):
    meeting_date: datetime
    participant_ids: List[int] = []

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    participant_ids: Optional[List[int]] = None
    summary: Optional[str] = None

# Validator to map participant objects to their names before validation
def coerce_participants_to_names(v) -> List[str]:
    if isinstance(v, list):
        return [p.name if hasattr(p, 'name') else str(p) for p in v]
    return v

CoercedParticipantList = Annotated[List[str], BeforeValidator(coerce_participants_to_names)]

class MeetingListResponse(BaseModel):
    id: int
    title: str
    meeting_date: datetime
    duration_seconds: int
    participants: CoercedParticipantList

    model_config = ConfigDict(from_attributes=True)

class MeetingDetailResponse(MeetingBase):
    id: int
    meeting_date: datetime
    participants: List[ParticipantShortResponse]
    transcript: List[TranscriptSegmentResponse]
    action_items: List[ActionItemResponse]

    model_config = ConfigDict(from_attributes=True)
