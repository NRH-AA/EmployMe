from app.models import db, Image, environment, SCHEMA
from sqlalchemy.sql import text

default_image = 'https://www.computerhope.com/jargon/g/guest-user.png'

def seed_images():
    for i in range(5):
        image = Image(
            url = default_image
        )
        db.session.add(image)
        
    db.session.commit()
    
def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))
        
    db.session.commit()
