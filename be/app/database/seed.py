import sys
import os
import random
from datetime import datetime, timedelta, timezone

# Add the parent directory of 'app' to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.db import SessionLocal, engine, Base
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.transcript import TranscriptSegment
from app.models.action_item import ActionItem

def seed_db():
    print("Dropping all tables to ensure clean seed...")
    Base.metadata.drop_all(bind=engine)
    print("Recreating all tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Create 6 global Participants
        participants_data = [
            {"name": "Aditya Sahrawat", "email": "aditya@example.com"},
            {"name": "Rahul Kumar", "email": "rahul@example.com"},
            {"name": "Alice Smith", "email": "alice@example.com"},
            {"name": "Bob Jones", "email": "bob@example.com"},
            {"name": "Carol Danvers", "email": "carol@example.com"},
            {"name": "David Miller", "email": "david@example.com"},
        ]
        
        participants = []
        for p_data in participants_data:
            p = Participant(name=p_data["name"], email=p_data["email"])
            db.add(p)
            participants.append(p)
        db.flush()  # Flush to assign IDs
        print(f"Seeded {len(participants)} global participants.")

        # 2. Meetings configuration
        meetings_data = [
            {
                "title": "Weekly Engineering Sync",
                "summary": "Weekly check-in on developer tasks. Covered API designs, sqlite db structure, and backend services implementation progress.",
                "duration_seconds": 1800,
                "days_ago": 4
            },
            {
                "title": "Sprint Planning - Q3 Features",
                "summary": "Planning sprint scope for core features. Defined user requirements for meeting details page, search functionality, and transcript editing.",
                "duration_seconds": 2400,
                "days_ago": 3
            },
            {
                "title": "Product Design & Layout Review",
                "summary": "Reviewed UI mockups for meeting platform dashboard. Iterated on CSS styling, dark mode, typography, and search query highlights.",
                "duration_seconds": 3600,
                "days_ago": 2
            },
            {
                "title": "Marketing & Launch Strategy",
                "summary": "Discussed launch timelines, copy drafts, user onboarding flow, and preparing initial promotional materials.",
                "duration_seconds": 1200,
                "days_ago": 1
            },
            {
                "title": "Post-Mortem: Database Migration Issue",
                "summary": "Investigated recent database constraint issue with cascading deletes. Action items defined to resolve foreign key support on SQLite.",
                "duration_seconds": 3000,
                "days_ago": 0
            }
        ]

        # Dialogue sentences for transcript generation
        dialogue_pool = [
            "Let's review our goals for this week.",
            "I think we need to focus on database migration first.",
            "Agreed, we should make sure foreign keys are enabled in SQLite.",
            "I will handle that part today.",
            "What about the frontend layout? Do we use Tailwind CSS?",
            "Yes, we'll keep the styles clean and modern.",
            "I can work on the UI components for the dashboard.",
            "Great, let's make sure the search filter works across title and participants.",
            "Should the search be case-insensitive?",
            "Yes, that's definitely a better user experience.",
            "Let's write some unit tests to verify the endpoints.",
            "I can help write tests for the transcript services.",
            "Excellent, let's aim for 80% coverage.",
            "How is the deployment pipeline looking?",
            "We're setting up a Dockerfile for the backend service.",
            "Don't forget to include the .dockerignore file.",
            "Done, I just added it to ignore .venv and cached files.",
            "What is the estimate for the frontend routing?",
            "It should take around a day using Next.js App Router.",
            "Awesome, let's sync up again tomorrow morning.",
            "Thanks everyone, have a great day!",
            "See you all tomorrow.",
            "Let me share my screen to show the current progress.",
            "That looks really neat, the glassmorphism layout works well.",
            "Let's make sure we handle the empty states for transcript searches.",
            "Good catch, I will add a placeholder for that.",
            "Are there any blockers for the sprint?",
            "No major blockers, we're on track.",
            "Perfect. Let's close this ticket.",
            "I will update the Jira board after this call.",
            "We should probably write a seed script to populate mock data.",
            "Yes, it should create meetings, participants, transcripts, and action items.",
            "Let's make sure it has at least 100 transcript lines so we can test scrolling.",
            "Good point, a long transcript is great for pagination or infinite scroll testing.",
            "I will prepare some sample tech discussion scripts for that.",
            "Let's check the API performance with long transcripts.",
            "It should be very fast with SQLite index.",
            "Are there any security concerns with storing transcript text?",
            "We should encrypt personal info if needed, but for now standard text is fine.",
            "Got it. Let's proceed with the current schema."
        ]

        action_tasks = [
            "Fix database schema cascading deletes",
            "Implement search endpoint for transcripts",
            "Design meeting notes dashboard UI",
            "Set up CORS policies on backend",
            "Create mock screenshots for product review",
            "Write integration tests for API endpoints",
            "Optimize SQLite query performance",
            "Refactor frontend layout to dark mode",
            "Configure Docker environment variables",
            "Draft release notes for beta users",
            "Establish automated error reporting logs",
            "Draft database rollback guidelines",
            "Conduct frontend performance audit",
            "Optimize image assets for fast loading",
            "Schedule user acceptance testing session"
        ]

        # 3. Populate meetings, transcripts, and action items
        for idx, m_data in enumerate(meetings_data):
            meeting_date = datetime.now(timezone.utc) - timedelta(days=m_data["days_ago"])
            meeting_date = meeting_date.replace(hour=10, minute=0, second=0, microsecond=0)
            
            # Select random number of participants between 4 and 6
            num_m_participants = random.randint(4, 6)
            m_participants = random.sample(participants, num_m_participants)

            meeting = Meeting(
                title=m_data["title"],
                summary=m_data["summary"],
                duration_seconds=m_data["duration_seconds"],
                meeting_date=meeting_date,
                participants=m_participants
            )
            db.add(meeting)
            db.flush()

            # Generate random number of Transcript Segments between 50 and 100
            num_segments = random.randint(50, 100)
            timestamp = 0
            interval = m_data["duration_seconds"] // num_segments
            if interval == 0:
                interval = 15

            for i in range(num_segments):
                # Pick speaker from the meeting's selected participants
                speaker = m_participants[i % len(m_participants)]
                dialogue = dialogue_pool[i % len(dialogue_pool)]
                content = f"[{i + 1}] {dialogue}"
                
                segment = TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker_name=speaker.name,
                    timestamp_seconds=timestamp,
                    content=content
                )
                db.add(segment)
                timestamp += interval

            # Generate random number of Action Items between 4 and 6
            num_action_items = random.randint(4, 6)
            for j in range(num_action_items):
                # Select random task from pool
                task_text = random.choice(action_tasks)
                # Assign to one of the meeting participants
                assignee = random.choice(m_participants)
                completed_status = random.choice([True, False])
                
                action_item = ActionItem(
                    meeting_id=meeting.id,
                    task=task_text,
                    assignee=assignee.name,
                    completed=completed_status,
                    created_at=meeting_date + timedelta(minutes=random.randint(15, 45))
                )
                db.add(action_item)

        db.commit()
        print("Database seeded successfully with meetings, randomized participants, transcripts, and action items!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
