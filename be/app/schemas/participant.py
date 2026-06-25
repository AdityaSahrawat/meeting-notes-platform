from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class ParticipantBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: Optional[str] = Field(None, max_length=255)

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantResponse(ParticipantBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
