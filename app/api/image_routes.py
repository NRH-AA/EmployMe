from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Image
from app.utils import (
    upload_file_to_s3, allowed_file, get_unique_filename)

image_routes = Blueprint('images', __name__)


@image_routes.route('/<int:id>', methods=['POST'])
@login_required
def update_image(id):
    data = request.get_json()
    user_id = data['userId']
    url = data['url']
    
    image = Image.query.get(id)

    if not image:
        return {'errors', ['Failed to find image']}, 400
    
    image.url = url
    db.session.commit()
    
    user = User.query.get(user_id)
    return user.to_dict_all()
