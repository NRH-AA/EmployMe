from app.models import db, Post, Image, environment, SCHEMA
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        user_id = 2,
        post_title = "Example Post Title",
        post_text = "Example Post Text"
    )
    post2 = Post(
        user_id = 2,
        post_title = "Example Post Title 2",
        post_text = "Example Post Text 2"
    )
    
    images = Image.query.all()
    add_images_post1 = [post1.images.append(image) for image in images]
    
    posts = [post1, post2]
    add_posts = [db.session.add(post) for post in posts]
    db.session.commit()
    
def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()
    
