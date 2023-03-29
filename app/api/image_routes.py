from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, PostImage
from app.utils import (
    upload_file_to_s3, allowed_file, get_unique_filename)

image_routes = Blueprint('images', __name__)


@image_routes.route('', methods=['PUT'])
@login_required
def update_image():
    data = request.get_json()
    user_id = data['userId']
    post_id = data['postId']
    images = data['images']

    for image in images:
        if 'id' in image and image['id'] != None:
            updateImage = PostImage.query.get(image['id'])
            updateImage.url = image['url']
        else:
            newImage = PostImage(
                post_id = post_id,
                url = image['url']
            )
            
            db.session.add(newImage)
    
    db.session.commit()
    user = User.query.get(user_id)
    return user.to_dict_all()
