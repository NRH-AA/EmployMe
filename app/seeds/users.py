from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

default_profile_picture = 'https://www.computerhope.com/jargon/g/guest-user.png'

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', 
        email='demo@aa.io',
        password='password',
        first_name = 'Demo',
        last_name = 'User',
        profile_picture = default_profile_picture,
        age = 120
    )
    hank = User(
        username='Hank', 
        email='hank@aa.io', 
        password='password',
        first_name = 'Hank',
        last_name = 'Hill',
        occupation = 'Sales Manager',
        company_name = 'Strickland Propane',
        work_email = 'HankHill@propane.arlen',
        profile_picture='https://m.media-amazon.com/images/M/MV5BMTUzMTQ4NjcyN15BMl5BanBnXkFtZTgwMDY5MDk0MjE@._V1_QL75_UY281_CR93,0,190,281_.jpg',
        age = 51
    )
    bobby = User(
        username='bobby', 
        email='bobby@aa.io', 
        password='password',
        first_name = 'Bobby',
        last_name = 'Hill',
        profile_picture='https://static.wikia.nocookie.net/kingofthehill/images/5/59/Bobbeah.jpg',
        age = 16
    )

    db.session.add(demo)
    db.session.add(hank)
    db.session.add(bobby)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
