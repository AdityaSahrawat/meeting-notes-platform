from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.action_item import ActionItemCreate, ActionItemUpdate, ActionItemResponse
from app.services import action_item_service
from typing import List

router = APIRouter()

@router.get("/meetings/{meeting_id}/action-items", response_model=List[ActionItemResponse], tags=["Action Items"])
def get_action_items(meeting_id: int, db: Session = Depends(get_db)):
    return action_item_service.get_action_items(db, meeting_id)

@router.post("/meetings/{meeting_id}/action-items", response_model=ActionItemResponse, tags=["Action Items"])
def create_action_item(meeting_id: int, action_item: ActionItemCreate, db: Session = Depends(get_db)):
    return action_item_service.create_action_item(db, meeting_id, action_item)

@router.put("/action-items/{action_item_id}", response_model=ActionItemResponse, tags=["Action Items"])
def update_action_item(action_item_id: int, action_item_data: ActionItemUpdate, db: Session = Depends(get_db)):
    return action_item_service.update_action_item(db, action_item_id, action_item_data)

@router.delete("/action-items/{action_item_id}", tags=["Action Items"])
def delete_action_item(action_item_id: int, db: Session = Depends(get_db)):
    return action_item_service.delete_action_item(db, action_item_id)
