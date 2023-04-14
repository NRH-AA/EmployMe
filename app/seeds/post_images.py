from app.models import db, Post, PostImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()

default_picture = 'https://assets.website-files.com/61e2d9500e1bc451a3ea1aa3/629a49e7ab53625cb2c4e791_Brand-pattern.jpg'

def seed_post_images():
    posts = Post.query.all()
    
    for post in posts:
        for i in range(5):
            image = PostImage(
                post_id=post.id,
                url=default_picture
            )
            
            db.session.add(image)

    db.session.commit()
    
def undo_post_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.post_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts_images"))
        
    db.session.commit()
