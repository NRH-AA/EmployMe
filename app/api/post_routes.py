from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Post, Image
from datetime import datetime

post_routes = Blueprint('posts', __name__)

@post_routes.route('', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()
    user_id = data['userId']
    title = data['title']
    text = data['text']
    urls = data['urls']
    
    post = Post(
        post_title = title,
        post_text = text
    )
    
    for url in urls:
        image = Image(url = url)
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
    post_title = data['postTitle'] or False
    post_text = data['postText'] or False
    user_id = data['userId'] or False
    
    if not user_id:
        return {'errors': ['User was not specified']}, 400
    
    post = Post.query.get(id)
    
    if not post:
        return {'errors': ['Unable to find post']}, 400
    
    user = User.query.get(user_id)
    if not user:
        return {'errors': ['Unable to find user']}, 400
    
    if post_title:
        post.post_title = post_title
        
    if post_text:
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
