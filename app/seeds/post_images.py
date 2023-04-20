from app.models import db, Post, PostImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint
fake = Faker()

pictures = [
    'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg',
    'https://cdn.shopify.com/s/files/1/0086/0795/7054/articles/Cat_s_Mind_x630.jpg',
    'https://www.rd.com/wp-content/uploads/2019/09/Cute-cat-lying-on-his-back-on-the-carpet.-Breed-British-mackerel-with-yellow-eyes-and-a-bushy-mustache.-Close-up-e1573490045672.jpg',
    'https://paradepets.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.jpg',
    'https://www.wfla.com/wp-content/uploads/sites/71/2023/03/everything-you-need-to-make-a-puppy-starter-kit.jpg',
    'https://www.telegraph.co.uk/content/dam/pets/2017/09/12/TELEMMGLPICT000135905939_trans_NvBQzQNjv4Bqc_R-fZbnPPOo5bCoTTw0Os4mAsl1MUKU7tcoIT3SAGY.jpeg',
    'https://i.natgeofe.com/k/559a884a-41d7-4731-b940-96f4cf2c8831/puppy-life-book-5_2x1.jpg',
    'https://images.ctfassets.net/sfnkq8lmu5d7/4Ma58uke8SXDQLWYefWiIt/3f1945422ea07ea6520c7aae39180101/2021-11-24_Singleton_Puppy_Syndrome_One_Puppy_Litter.jpg',
    'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg',
    'https://thumbs.dreamstime.com/b/landscape-sunset-view-morain-lake-mountain-range-alberta-canada-44613434.jpg',
    'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
    'https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204__340.jpg',
    'https://cdn.wallpapersafari.com/24/58/fkjzuV.jpg',
    'https://expertphotography.b-cdn.net/wp-content/uploads/2022/05/Landscape-Photography-Sophie-Turner.jpg',
    'https://www.format.com/wp-content/uploads/symmetrical_clouds_reflection_in_water.jpg'
]


def seed_post_images():
    posts = Post.query.all()
    
    for post in posts:
        for i in range(5):
            image = PostImage(
                post_id=post.id,
                url=pictures[randint(0, len(pictures) - 1)]
            )
            
            db.session.add(image)
            post.images.append(image)
            
    db.session.commit()
    
def undo_post_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.post_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts_images"))
        
    db.session.commit()
