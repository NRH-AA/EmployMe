from app.models import db, User, JobListing, environment, SCHEMA
from sqlalchemy.sql import text

def seed_job_listings():
    job1 = JobListing(
        user_id = 2,
        occupation = 'Team Member',
        wage_min = 10,
        wage_max = 12,
        title = 'Strickland Propane Team Member',
        description = 'As a team member you will be responsible for customer service, filling propane tanks, and the sale of Strickland Propane products and servies.',
        openings = 3,
        filled = 1
    )
    
    job2 = JobListing(
        user_id = 4,
        occupation = 'Door mat',
        wage_min = 3,
        wage_max = 5,
        title = 'Actress for T.V. Comedy show Family Guy',
        description = 'Family guy is looking for an actress to fill the role of Meg Griffin. You may be subject to Peter\'s descrimination and farts at anytime.',
        openings = 1,
        filled = 0
    )
    
    jobs = [job1, job2]
    add_jobs = [db.session.add(job) for job in jobs]
    db.session.commit()
    
def undo_job_listings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.job_listings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM job_listings"))
        
    db.session.commit()
