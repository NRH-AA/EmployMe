from app.models import db, User, UserImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()

default_profile_picture = 'https://www.computerhope.com/jargon/g/guest-user.png'
jobs = [
    'Web Development',
    'Cashier',
    'Sales Manager',
    'English Teacher',
    'Edgy',
    'Pharmacist',
    'Data Analytics',
    'Political Scientist?',
    'C.E.O.',
    'Hardware Engineer',
    'Software Engineer'
]

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
        age = 32
    )
    
    for i in range(20):
        newUser = User(
            username=fake.user_name(),
            email=fake.email(),
            password='password',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            occupation=jobs[randint(0, len(jobs) - 1)],
            phone_number=fake.phone_number(),
            work_email=fake.company_email(),
            profile_picture=default_profile_picture,
            age=randint(18, 50)
        )
        
        db.session.add(newUser)
    
    db.session.add(demo)
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
