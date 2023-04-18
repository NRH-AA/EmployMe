from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_connections():
    demo = User.query.get(1)
    user2 = User.query.get(2)
    user3 = User.query.get(3)
    
    demo.connecting.append(user2)
    demo.connecting.append(user3)
    
    db.session.commit()
    

def undo_connections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.connections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM connections"))
        
    db.session.commit()
