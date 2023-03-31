from app.models import db, Post, PostImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()


def seed_posts():
    for i in range(100):
        newPost = Post(
            user_id = randint(1, 20),
            post_title = fake.sentence(),
            post_text = fake.paragraph()
        )
        
        db.session.add(newPost)
    
    db.session.commit()
    
def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()
    
