from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, JobListing, Post
from sqlalchemy import desc, asc
from app.utils import (
    upload_file_to_s3, allowed_file, get_unique_filename)

user_routes = Blueprint('users', __name__)


@user_routes.route('')
@login_required
def all_users():
    users = User.query.order_by(desc('updatedAt')).limit(10)
    return {'users': [user.to_dict_all() for user in users]}

@user_routes.route('/')
@login_required
def all_users2():
    users = User.query.order_by(desc('updatedAt')).limit(10)
    return {'users': [user.to_dict_all() for user in users]}

@user_routes.route('', methods=['POST'])
@login_required
def get_searched_users():
    data = request.get_json()
    sText = data['searchText']
    offset = data['offset'] or 0
    
    results = None
    if not sText or sText == '':
        results = User.query.order_by('updatedAt').limit(6).offset(offset)
    else:
        results = User.query.where(
            User.first_name.ilike(sText + '%%') |
            User.last_name.ilike(sText + '%%')
        ).order_by(desc(User.first_name)).limit(6).offset(offset)
    
    if not results is None:
        return {'posts': [user.posts.to_dict() for user in results]}
    
    return {'posts': []}
    

@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict_all()

@user_routes.route('/<int:id>', methods=['POST'])
@login_required
def update_user(id):
    data = request.get_json()
    occupation = data['occupation'] or ''
    company_name = data['company_name'] or ''
    bio = data['bio'] or ''
    
    user = User.query.get(id)
    user.occupation = occupation
    user.company_name = company_name
    user.bio = bio
    
    db.session.commit()
    ret = User.query.get(id)
    
    return ret.to_dict_all()

@user_routes.route('/<int:id>/theme', methods=['POST'])
@login_required
def update_user_theme(id):
    data = request.get_json()
    theme = data['theme']
    
    user = User.query.get(id)
    user.theme = theme
    
    db.session.commit()
    ret = User.query.get(id)
    
    return ret.to_dict_all()

@user_routes.route('/<int:id>/picture', methods=['POST'])
@login_required
def update_user_picture(id):
    profile_picture = request.get_json()['profile_picture']
    
    if not profile_picture:
        return {'errors': ['Failed to get profile picture']}, 400
    
    user = User.query.get(id)
    user.profile_picture = profile_picture
    db.session.commit()
    ret = User.query.get(id)
    return ret.to_dict_all()

@user_routes.route('/<int:id>/skills', methods=['POST'])
@login_required
def update_user_skills(id):
    skills = request.get_json()['skills']
    user = User.query.get(id)
    user.skills = skills or ''
    db.session.commit()
    ret = User.query.get(id)
    return ret.to_dict_all()
    

@user_routes.route('/upload', methods=['POST'])
@login_required
def upload_image():
    if "image" in request.files:
        image = request.files["image"]

    if not allowed_file(image.filename):
        return {"errors": "file type not permitted"}, 400

    image.filename = get_unique_filename(image.filename)

    upload = upload_file_to_s3(image)

    if "url" not in upload:
        return upload, 400

    imageURL = upload["url"]
    return {"url": imageURL}

@user_routes.route('/<int:id>/profile', methods=['DELETE'])
@login_required
def delete_profile(id):
    user = User.query.get(id)
    
    if not user:
        return {'errors', ['Unable to find user']}, 400
    
    user.active = not user.active
    db.session.commit()
    ret = User.query.get(id)
    return ret.to_dict_all()

import json
import os

@user_routes.route('/createNewsData', methods=['post'])
@login_required
def create_news_data():
    data = request.get_json()
    newsData = data['newsData']
    
    for news in newsData:
        with open(f'{os.getcwd()}/app/api/newsData.json', "a") as outfile:
            json.dump(news, outfile)
        
    return {'message': 'success'}, 200

@user_routes.route('/getNewsData')
@login_required
def get_news_data():
    
    with open(f'{os.getcwd()}/app/api/newsData.json') as infile:
        news_dictionary = json.load(infile)
        return {'news': [news for news in news_dictionary]}, 200
