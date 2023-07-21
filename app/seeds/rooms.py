from app.models import db, Room, environment, SCHEMA
from sqlalchemy.sql import text

def seed_rooms():
    room = Room(
        user_id = 1
    )
    
    db.session.add(room)
    db.session.commit()
    
def undo_rooms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rooms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rooms"))
        
    db.session.commit()
