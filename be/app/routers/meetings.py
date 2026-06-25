from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.meeting import MeetingCreate, MeetingUpdate, MeetingListResponse, MeetingDetailResponse
from app.schemas.participant import ParticipantCreate, ParticipantResponse
from app.services import meeting_service
from typing import List, Optional

router = APIRouter()

# Meeting Endpoints
@router.get("/meetings", response_model=List[MeetingListResponse], tags=["Meetings"])
def list_meetings(
    search: Optional[str] = Query(None, description="Search by title or participant name"),
    sort: Optional[str] = Query(None, description="Sort order: date/date_asc or -date/date_desc"),
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    participant: Optional[str] = Query(None, description="Filter by participant name or ID"),
    time_range: Optional[str] = Query(None, description="Filter by time range: today or this_week"),
    db: Session = Depends(get_db)
):
    return meeting_service.get_meetings(db, search, sort, date, participant, time_range)

@router.get("/meetings/{meeting_id}", response_model=MeetingDetailResponse, tags=["Meetings"])
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    return meeting_service.get_meeting_by_id(db, meeting_id)

@router.post("/meetings", response_model=MeetingDetailResponse, tags=["Meetings"])
def create_meeting(meeting_data: MeetingCreate, db: Session = Depends(get_db)):
    return meeting_service.create_meeting(db, meeting_data)

@router.put("/meetings/{meeting_id}", response_model=MeetingDetailResponse, tags=["Meetings"])
def update_meeting(meeting_id: int, meeting_data: MeetingUpdate, db: Session = Depends(get_db)):
    return meeting_service.update_meeting(db, meeting_id, meeting_data)

@router.delete("/meetings/{meeting_id}", tags=["Meetings"])
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    return meeting_service.delete_meeting(db, meeting_id)

# Participant Endpoints
@router.get("/participants", response_model=List[ParticipantResponse], tags=["Participants"])
def list_participants(db: Session = Depends(get_db)):
    return meeting_service.get_participants(db)

@router.post("/participants", response_model=ParticipantResponse, tags=["Participants"])
def create_participant(participant_data: ParticipantCreate, db: Session = Depends(get_db)):
    return meeting_service.create_participant(db, participant_data)
