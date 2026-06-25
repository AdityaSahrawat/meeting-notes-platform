import sys
import os

# Add the parent directory of 'app' to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.db import engine, Base
# Import models to register them with Base metadata
from app.models import meeting, participant, transcript, action_item

def seed_db():
    print("Dropping all tables to ensure database is empty...")
    Base.metadata.drop_all(bind=engine)
    print("Recreating all tables (blank database)...")
    Base.metadata.create_all(bind=engine)
    print("Database is now clean and empty!")

if __name__ == "__main__":
    seed_db()
