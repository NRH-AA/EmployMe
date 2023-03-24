from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Post

post_routes = Blueprint('posts', __name__)

@post_routes.route('/<int:id>', methods=['POST'])
@login_required
def create_post(id):
    pass

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
        
    db.session.commit()
    return user.to_dict_all()

@post_routes.route('/<int:id>/images')
@login_required
def add_post_image(id):
    pass
