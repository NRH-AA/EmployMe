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
        occupation = 'Demo Occupation',
        phone_number = '123-456-7890',
        company_name = 'Demo Company Name',
        work_email = 'SuperDemo@aa.io',
        profile_picture = default_profile_picture,
        age = 40
    )
    hank = User(
        username='Hank', 
        email='hank@aa.io', 
        password='password',
        first_name = 'Hank',
        last_name = 'Hill',
        occupation = 'Sales Manager',
        phone_number = '912-748-4422',
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
        occupation = 'Gamer',
        phone_number = '912-748-4422',
        company_name = '',
        work_email = 'IDontWork@aa.io',
        profile_picture='https://static.wikia.nocookie.net/kingofthehill/images/5/59/Bobbeah.jpg',
        age = 16
    )
    Peter = User(
        username='PeterGriffen', 
        email='peter@aa.io', 
        password='password',
        first_name = 'Justin',
        middle_name = 'Peter',
        last_name = 'McFinnigan',
        occupation = 'Actor',
        phone_number = '144-144-1444',
        company_name = 'Family Guy Studios',
        work_email = 'PetersGreat@Quahog.io',
        profile_picture='https://www.looper.com/img/gallery/the-real-life-inspiration-for-family-guys-peter-griffin/intro-1672162426.jpg',
        age = 46
    )
    Gandalf = User(
        username='Gandalfgreat', 
        email='gandalf@aa.io', 
        password='password',
        first_name = 'Gandalf',
        middle_name = 'The',
        last_name = 'Grey',
        occupation = 'Wizard',
        phone_number = '144-144-1444',
        company_name = '',
        work_email = 'GandalfTheGrey@Mordor.io',
        profile_picture='https://cdn.vox-cdn.com/thumbor/JTU_mffWCBNC0NmjqOk6ycI8HDw=/0x0:3823x1595/1400x933/filters:focal(1607x493:2217x1103):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/70505683/ian_mckellan_gandalf_4k_lotr.0.jpg',
        age = 24000
    )
    
    users = [demo, hank, bobby, Peter, Gandalf]
    
    add_users = [db.session.add(user) for user in users]
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
