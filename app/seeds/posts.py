from app.models import db, Post, PostImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        user_id = 1,
        post_title = "Demo Post Title",
        post_text = "This is a demo post's text. Its only utility is to showcase how a post is structured"
    )
    post2 = Post(
        user_id = 1,
        post_title = "Demo Post Title2",
        post_text = "This is a demo post's text. Its only utility is to showcase how a post is structured"
    )
    post3 = Post(
        user_id = 2,
        post_title = "Strickland Propane!",
        post_text = "We have propane and propane accessories here at Strickland Propane. Come on over and be greated by the best god dang crew ever."
    )
    post4 = Post(
        user_id = 3,
        post_title = "Why do you hate what you don't understand?",
        post_text = "Think about it, Luanne. Why would you bring a child to a department store to buy a dryer when his birthday is three-and-a-half weeks away? It just doesn't make sense!"
    )
    post5 = Post(
        user_id = 4,
        post_title = "Shipoopi!",
        post_text = "shipoopi, shipoopi, shipoopi The girl who's hard to get."
    )
    post6 = Post(
        user_id = 5,
        post_title = "Hobbits!",
        post_text = "We're taking the hobbits to Isengard. We're taking the hobbits to Isengard. We're taking the hobbits to Isengard, gard, gard"
    )
    
    
    posts = [post1, post2, post3, post4, post5, post6]
    
    add_posts = [db.session.add(post) for post in posts]
    db.session.commit()
    
def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()
    
