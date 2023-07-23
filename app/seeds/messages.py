from app.models import db, User, Message, environment, SCHEMA
from sqlalchemy.sql import text

def seed_messages():
    messageOne = Message(
        room_id = 1,
        sent_by = 2,
        text = 'Test Message One'
    )
    
    messageTwo = Message(
        room_id = 2,
        sent_by = 3,
        text = 'Test Message Two'
    )
    
    messages = [messageOne, messageTwo]
    
    add_messages = [db.session.add(message) for message in messages]
    db.session.commit()
    
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))
        
    db.session.commit()
