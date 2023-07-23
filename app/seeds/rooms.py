from app.models import db, Room, environment, SCHEMA
from sqlalchemy.sql import text

def seed_rooms():
    roomOne = Room(
        user_id = 1
    )
    
    roomTwo = Room(
        user_id = 1
    )
    
    rooms = [roomOne, roomTwo]
    
    add_rooms = [db.session.add(room) for room in rooms]
    db.session.commit()
    
def undo_rooms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rooms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rooms"))
        
    db.session.commit()
