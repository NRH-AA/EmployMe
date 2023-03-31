from app.models import db, User, JobListing, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()

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

def seed_job_listings():
    for i in range(20):
        newJob = JobListing(
            user_id = i + 1,
            occupation = jobs[randint(0, len(jobs) - 1)],
            wage_min = randint(10,12),
            wage_max = randint(14, 20),
            title = fake.sentence(),
            description = fake.paragraph(nb_sentences=6),
            openings = randint(1, 3),
            filled = 0
        )
        
        db.session.add(newJob)
    
    db.session.commit()

def undo_job_listings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.job_listings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM job_listings"))
        
    db.session.commit()
