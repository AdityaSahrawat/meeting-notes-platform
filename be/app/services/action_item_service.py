from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.action_item import ActionItem
from app.services.meeting_service import get_meeting_by_id
from app.schemas.action_item import ActionItemCreate, ActionItemUpdate
from typing import List

def get_action_items(db: Session, meeting_id: int) -> List[ActionItem]:
    # Ensure meeting exists
    get_meeting_by_id(db, meeting_id)
    return db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).all()

def create_action_item(db: Session, meeting_id: int, action_item: ActionItemCreate) -> ActionItem:
    # Ensure meeting exists
    get_meeting_by_id(db, meeting_id)
    
    db_item = ActionItem(
        meeting_id=meeting_id,
        task=action_item.task,
        assignee=action_item.assignee,
        completed=action_item.completed
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_action_item(db: Session, action_item_id: int, action_item_data: ActionItemUpdate) -> ActionItem:
    db_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with ID {action_item_id} not found"
        )
    
    if action_item_data.task is not None:
        db_item.task = action_item_data.task
    if action_item_data.assignee is not None:
        db_item.assignee = action_item_data.assignee
    if action_item_data.completed is not None:
        db_item.completed = action_item_data.completed
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_action_item(db: Session, action_item_id: int) -> dict:
    db_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with ID {action_item_id} not found"
        )
    db.delete(db_item)
    db.commit()
    return {"detail": f"Action item {action_item_id} deleted successfully"}
