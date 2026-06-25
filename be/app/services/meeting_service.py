from datetime import datetime
from sqlalchemy import or_, func, desc, asc
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.schemas.meeting import MeetingCreate, MeetingUpdate
from app.schemas.participant import ParticipantCreate
from typing import Optional, List

def get_meetings(
    db: Session,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    date_filter: Optional[str] = None,
    participant_filter: Optional[str] = None
) -> List[Meeting]:
    query = db.query(Meeting)

    # Search filter (searches title or participant name)
    if search:
        # Join participants for search
        query = query.join(Meeting.participants, isouter=True).filter(
            or_(
                Meeting.title.ilike(f"%{search}%"),
                Participant.name.ilike(f"%{search}%")
            )
        ).distinct()

    # Participant filter (searches by participant name or ID)
    if participant_filter:
        if participant_filter.isdigit():
            query = query.filter(Meeting.participants.any(Participant.id == int(participant_filter)))
        else:
            query = query.filter(Meeting.participants.any(Participant.name.ilike(f"%{participant_filter}%")))

    # Date filter (expects YYYY-MM-DD)
    if date_filter:
        try:
            # Parse to validate format
            parsed_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
            # In SQLite, dates are stored as strings (YYYY-MM-DD HH:MM:SS.UUUUUU).
            # We can use func.date() to extract the date portion for comparison.
            query = query.filter(func.date(Meeting.meeting_date) == parsed_date.isoformat())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Date filter must be in YYYY-MM-DD format"
            )

    # Sort logic
    if sort:
        if sort.lower() == "date_asc" or sort == "date":
            query = query.order_by(asc(Meeting.meeting_date))
        elif sort.lower() == "date_desc" or sort == "-date":
            query = query.order_by(desc(Meeting.meeting_date))
        else:
            # Default fallback sort by date descending
            query = query.order_by(desc(Meeting.meeting_date))
    else:
        query = query.order_by(desc(Meeting.meeting_date))

    return query.all()

def get_meeting_by_id(db: Session, meeting_id: int) -> Meeting:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with ID {meeting_id} not found"
        )
    return meeting

def create_meeting(db: Session, meeting_data: MeetingCreate) -> Meeting:
    # Resolve participants
    participants = []
    if meeting_data.participant_ids:
        participants = db.query(Participant).filter(Participant.id.in_(meeting_data.participant_ids)).all()
        if len(participants) != len(meeting_data.participant_ids):
            found_ids = {p.id for p in participants}
            missing_ids = set(meeting_data.participant_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Participants with IDs {list(missing_ids)} do not exist"
            )

    db_meeting = Meeting(
        title=meeting_data.title,
        meeting_date=meeting_data.meeting_date,
        duration_seconds=meeting_data.duration_seconds,
        summary=meeting_data.summary,
        participants=participants
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def update_meeting(db: Session, meeting_id: int, meeting_data: MeetingUpdate) -> Meeting:
    db_meeting = get_meeting_by_id(db, meeting_id)

    # Update simple fields
    if meeting_data.title is not None:
        db_meeting.title = meeting_data.title
    if meeting_data.meeting_date is not None:
        db_meeting.meeting_date = meeting_data.meeting_date
    if meeting_data.duration_seconds is not None:
        db_meeting.duration_seconds = meeting_data.duration_seconds
    if meeting_data.summary is not None:
        db_meeting.summary = meeting_data.summary

    # Update participants association if provided
    if meeting_data.participant_ids is not None:
        participants = db.query(Participant).filter(Participant.id.in_(meeting_data.participant_ids)).all()
        if len(participants) != len(meeting_data.participant_ids):
            found_ids = {p.id for p in participants}
            missing_ids = set(meeting_data.participant_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Participants with IDs {list(missing_ids)} do not exist"
            )
        db_meeting.participants = participants

    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def delete_meeting(db: Session, meeting_id: int) -> dict:
    db_meeting = get_meeting_by_id(db, meeting_id)
    db.delete(db_meeting)
    db.commit()
    return {"detail": f"Meeting {meeting_id} deleted successfully"}

# Participant operations
def get_participants(db: Session) -> List[Participant]:
    return db.query(Participant).order_by(Participant.name).all()

def create_participant(db: Session, participant_data: ParticipantCreate) -> Participant:
    db_participant = Participant(
        name=participant_data.name,
        email=participant_data.email
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant
