from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Image
from app.utils import (
    upload_file_to_s3, allowed_file, get_unique_filename)

image_routes = Blueprint('images', __name__)


@image_routes.route('', methods=['POST'])
@login_required
def create_images():
    pass

@image_routes.route('', methods=['PUT'])
@login_required
def update_image():
    data = request.get_json()
    user_id = data['userId']
    images = data['images']

    for image in images:
        updateImage = Image.query.get(image['id'])
        updateImage.url = image['url']
    
    db.session.commit()
    user = User.query.get(user_id)
    return user.to_dict_all()
