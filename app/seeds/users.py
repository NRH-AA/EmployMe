from app.models import db, User, UserImage, environment, SCHEMA
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
        skills = 'Skill1;Skill2;Skill3;Skill4;Skill5;Skill6',
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
    Quagmire = User(
        username='GlennQuagmire', 
        email='quagmire@aa.io', 
        password='password',
        first_name = 'Gleonard',
        middle_name = '',
        last_name = 'Quahmire',
        occupation = 'Pilot & Soup Kitchen',
        phone_number = '144-144-1444',
        company_name = 'American Airlines',
        work_email = 'GlennQuagmire@Quahog.io',
        profile_picture='https://images.entertainment.ie/storage/images_content/rectangle/620x372/glenn-quagmire-family-guy-11293-1920x1200.jpg',
        age = 61
    )
    Stan = User(
        username='StanTheMan', 
        email='stan@aa.io', 
        password='password',
        first_name = 'Stanford',
        middle_name = 'Leonard',
        last_name = 'Smith',
        occupation = 'CIA Agent',
        phone_number = '144-144-1444',
        company_name = 'Central Intelligence Agency',
        work_email = 'StanSmith@cia.io',
        profile_picture='https://i1.sndcdn.com/artworks-000672704347-vzhmdy-t500x500.jpg',
        age = 42
    )
    Randy = User(
        username='RandyMarsh', 
        email='randy@aa.io', 
        password='password',
        first_name = 'Randy',
        middle_name = '',
        last_name = 'Marsh',
        occupation = 'Geologist',
        phone_number = '144-144-1444',
        company_name = 'Unemployed',
        work_email = 'RandyMarsh@geo.io',
        profile_picture='https://cdn.shopify.com/s/files/1/0170/5859/4880/files/randyVideoOverlay_550a63f5-5ff4-4ac7-917f-630ba96e4673_1980x.png',
        age = 46
    )
    Albert = User(
        username='Einstein', 
        email='albert@aa.io', 
        password='password',
        first_name = 'Albert',
        middle_name = '',
        last_name = 'Einstein',
        occupation = 'Theoretical Physicist',
        phone_number = '144-144-1444',
        company_name = 'Entrepreneur',
        work_email = 'Einstein@genius.io',
        profile_picture='https://www.nobelprize.org/images/einstein-12923-content-portrait-mobile-tiny.jpg',
        age = 76
    )
    Donald = User(
        username='Trumpinator', 
        email='trump@aa.io', 
        password='password',
        first_name = 'Donald',
        middle_name = 'John',
        last_name = 'Trump',
        occupation = 'Fired',
        phone_number = '800-555-0123',
        company_name = 'Prison',
        work_email = 'Trumpinator@prison.io',
        profile_picture='https://stratus.hr/hubfs/blogs/2016/You_Fired_Donald_Trump-700x467.jpg',
        age = 76
    )
    
    
    users = [demo, hank, bobby, Peter, Gandalf, 
                Quagmire, Stan, Randy, Albert, Donald]
    
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
