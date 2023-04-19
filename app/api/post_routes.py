from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Post, PostImage
from sqlalchemy import desc, asc
from datetime import datetime

post_routes = Blueprint('posts', __name__)

@post_routes.route('/feed', methods=['POST'])
def get_posts():
    data = request.get_json()
    offset = data['offset']
    
    posts = Post.query.order_by(desc('createdAt')).limit(6).offset(offset)
    return {'posts': [post.to_dict() for post in posts]}

@post_routes.route('', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()
    user_id = data['userId']
    text = data['text']
    urls = data['urls']
    
    post = Post(
        post_text = text
    )
    
    for url in urls:
        image = PostImage(url = url)
        db.session.add(image)
        post.images.append(image)
        
    db.session.add(post)
    user = User.query.get(user_id)
    user.updatedAt = datetime.now()
    user.posts.append(post)
    db.session.commit()
    return user.to_dict_all()
    

@post_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_post(id):
    data = request.get_json()
    post_text = data['postText'] or False
    user_id = data['userId'] or False
    images = data['images'] or []
    
    errors = {}
    
    if not user_id:
        errors.user = 'Failed to get user id'
        return {'errors': errors}, 400
    
    post = Post.query.get(id)
    
    if not post:
        errors.post = 'Failed to find post'
        return {'errors': errors}, 400
    
    user = User.query.get(user_id)
    if not user:
        errors.user = 'User does not exist'
        return {'errors': errors}
        
    if post_text and (len(post_text) < 10 or len(post_text)) > 250:
        errors.text = 'Text (10-250) characters'
        
    if len(images) > 0:
        for img in images:
            if not img.get('id'):
                new_image = PostImage(
                    post_id=post.id,
                    url=img['url']
                )
                
                db.session.add(new_image)
            else:
                image = PostImage.query.get(img['id'])
                image.url=img['url']

    post.post_text = post_text
    post.updatedAt = datetime.now()
    user.updatedAt = datetime.now()

    db.session.commit()
    return user.to_dict_all()

@post_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    data = request.get_json()
    user_id = data['userId']
    
    post = Post.query.get(id)
    
    if not post:
        return {'errors': ['Failed to get post']}
    
    db.session.delete(post)
    db.session.commit()
    user = User.query.get(user_id)
    return user.to_dict_all()
