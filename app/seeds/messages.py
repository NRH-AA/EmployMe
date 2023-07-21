from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text

def seed_messages():
    message = Message(
        room_id = 1,
        sent_by = 1,
        text = 'Test Message One'
    )
    
    messageTwo = Message(
        room_id = 1,
        sent_by = 2,
        text = 'Test Message Two'
    )
    
    db.session.add(message)
    db.session.add(messageTwo)
    db.session.commit()
    
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))
        
    db.session.commit()
