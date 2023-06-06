from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()

def seed_post_comments():
    for i in range(200):
        new_comment = Comment(
            user_id = randint(1, 21),
            post_id = randint(1, 100),
            text = fake.paragraph(nb_sentences=3)
        )
        
        db.session.add(new_comment)
        
    db.session.commit()
    
def undo_post_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()
