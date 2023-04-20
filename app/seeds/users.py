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

profile_pictures = [
    'https://pbs.twimg.com/profile_images/1326707048478892033/Ln0v50LP_400x400.jpg',
    'https://www.bobross.com/content/bob_ross_img.png',
    'https://hips.hearstapps.com/hmg-prod/images/sean-connery-pointing-a-gun-up-with-his-finger-on-the-trigger-in-a-scene-from-the-film-james-bond-from-russia-with-love-1963-photo-by-united-artist_getty-images.jpg',
    'https://www.looper.com/img/gallery/the-real-life-inspiration-for-family-guys-peter-griffin/intro-1672162426.jpg',
    'https://i1.sndcdn.com/artworks-000672704347-vzhmdy-t500x500.jpg',
    'https://i.imgflip.com/1s0sw9.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/gettyimages-3091504.jpg',
    'https://cdn.vox-cdn.com/thumbor/JTU_mffWCBNC0NmjqOk6ycI8HDw=/0x0:3823x1595/1400x933/filters:focal(1607x493:2217x1103):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/70505683/ian_mckellan_gandalf_4k_lotr.0.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/gollum-banner-1553711488.jpg',
    'https://imgix.bustle.com/uploads/image/2021/3/12/a3d3f106-52b7-406e-87d3-f9edb1e6fb73-ab18acbf-2db6-404e-9044-3c5d9e925b97-cloud_bmp_jpgcopy.jpeg?w=1200&h=630&fit=crop&crop=faces&fm=jpg',
    'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Forest_Gump_Character.jpg/220px-Forest_Gump_Character.jpg',
    'https://api.time.com/wp-content/uploads/2014/08/robin-williams-portrait-by-brigitte-lacombe.jpg',
    'https://media1.popsugar-assets.com/files/thumbor/J7JlE_--VaBBOGnNoPJNgMhxkzU/0x159:4000x4159/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/03/31/019/n/1922398/856884545e83d1fc356e17.95060254_/i/Adam-Sandler.jpg',
    'https://cdn.shopify.com/s/files/1/0575/4381/9429/products/Boland-Fancy-Dress-Nerd-Glasses_grande.jpg',
    'https://deseret.brightspotcdn.com/dims4/default/d2a9ed4/2147483647/strip/false/crop/245x138+7+0/resize/1200x675!/quality/90/?url=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2F6TukK_D2Du3cPL8ck6UmF2LFUSk%3D%2F0x0%3A260x138%2F260x138%2Ffilters%3Afocal%28130x69%3A131x70%29%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F16728459%2F595115927.jpg',
    'https://lumiere-a.akamaihd.net/v1/images/solo-db-chewie-on-falcon-gallery_7f6e39ec.jpeg',
    'https://hips.hearstapps.com/hmg-prod/images/cute-cat-photos-1593441022.jpg',
    'https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg',
    'https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/10/21/09/rowan-atkinson.jpg',
    'https://wallpapercave.com/wp/wp5554098.jpg'
]

userInfo = [
    {'first_name': 'Rick', 'last_name': 'Roll'},
    {'first_name': 'Bob', 'last_name': 'Ross'},
    {'first_name': 'James', 'last_name': 'Bond'},
    {'first_name': 'Peter', 'last_name': 'Griffin'},
    {'first_name': 'Stan', 'last_name': 'Smith'},
    {'first_name': 'Chicken', 'last_name': 'McCluck'},
    {'first_name': 'Albert', 'last_name': 'Einstein'},
    {'first_name': 'Gandolf', 'last_name': 'The Grey'},
    {'first_name': 'Gollum', 'last_name': 'Smegal'},
    {'first_name': 'Cloud', 'last_name': 'Shinra'},
    {'first_name': 'Forest', 'last_name': 'Gump'},
    {'first_name': 'Robin', 'last_name': 'Williams'},
    {'first_name': 'Adam', 'last_name': 'Sandler'},
    {'first_name': 'Some', 'last_name': 'Nerd'},
    {'first_name': 'Anakin', 'last_name': 'Skywalker'},
    {'first_name': 'Chew', 'last_name': 'baka'},
    {'first_name': 'Detective', 'last_name': 'Mittens'},
    {'first_name': 'Mark', 'last_name': 'Zuckerburg'},
    {'first_name': 'Mr', 'last_name': 'Bean'},
    {'first_name': 'Donkey', 'last_name': 'McShrek'}
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
    
    db.session.add(demo)
    
    for i in range(20):
        newUser = User(
            username=fake.user_name(),
            email=fake.email(),
            password='password',
            first_name=userInfo[i]['first_name'],
            last_name=userInfo[i]['last_name'],
            occupation=jobs[randint(0, len(jobs) - 1)],
            phone_number=fake.phone_number(),
            work_email=fake.company_email(),
            profile_picture=profile_pictures[i],
            age=randint(18, 50)
        )
        
        db.session.add(newUser)
    
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
