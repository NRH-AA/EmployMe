from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User
from sqlalchemy import desc, asc, text
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
    type = data['searchType']
    sText = data['searchText']
    
    users = ''
    usersTwo = ''
    if type == 'name':
        if not sText or sText == '':
            users = User.query.order_by(asc('first_name')).limit(10)
        else:
            split = sText.split(" ")
            
            if len(split) == 3:
                users = User.query.where(User.first_name.ilike(split[0] + '%%'), 
                                         User.middle_name.ilike(split[1] + '%%'),
                                         User.last_name.ilike(split[2] + '%%')).limit(10)
                if users == '' or users.count() == 0:
                    users = User.query.where(User.first_name.ilike('%%' + split[0] + '%%'), 
                                         User.middle_name.ilike('%%' + split[1] + '%%'),
                                         User.last_name.ilike('%%' + split[2] + '%%')).limit(10)
                    if users == '' or users.count() == 0:
                        users = User.query.order_by(desc('updatedAt')).limit(10)
                
            elif len(split) == 2:
                users = User.query.where(User.first_name.ilike('%%' + split[0] + '%%'), 
                                         User.last_name.ilike('%%' + split[1] + '%%')).limit(10)
                if users == '' or users.count() == 0:
                    users = User.query.where(User.first_name.ilike('%%' + split[0] + '%%'), 
                                         User.last_name.ilike('%%' + split[1] + '%%')).limit(10)
                    if users == '' or users.count() == 0:
                        users = User.query.order_by(desc('updatedAt')).limit(10)
            
            else:
                users = User.query.where(User.first_name.ilike(sText + '%%')).limit(10)
                if users == '' or users.count() == 0:
                    users = User.query.where(User.first_name.ilike('%%' + sText + '%%')).limit(10)
                    if users == '' or users.count() == 0:
                        users = User.query.order_by(desc('updatedAt')).limit(10)
                    
                if users.count() < 10:
                    usersTwo = User.query.where(
                        User.middle_name.ilike('%%' + sText + '%%'),
                        User.last_name.ilike('%%' + sText + '%%'),
                        User.work_email.ilike('%%' + sText + '%%'),
                        User.occupation.ilike('%%' + sText + '%%'),
                        User.company_name.ilike('%%' + sText + '%%')).limit(10 - users.count())
                    
    elif type == 'email':
        if not sText:
            users = User.query.order_by(asc('work_email')).limit(10)
        else:
            users = User.query.where(User.work_email.ilike(sText + '%%')).limit(10)
            if users == '' or users.count() == 0:
                users = User.query.where(User.work_email.ilike('%%' + sText + '%%')).limit(10)
                if users == '' or users.count() == 0:
                        users = User.query.order_by(desc('updatedAt')).limit(10)
            
    elif type == 'occupation':
        if not sText:
            users = User.query.order_by(asc('occupation')).limit(10)
        else:
            users = User.query.where(User.occupation.ilike(sText + '%%')).limit(10)
            if users == '' or users.count() == 0:
                users = User.query.where(User.occupation.ilike('%%' + sText + '%%')).limit(10)
                if users == '' or users.count() == 0:
                        users = User.query.order_by(desc('updatedAt')).limit(10)
                
    if users == '' or users.count() == 0:
        users = User.query.order_by(desc('updatedAt')).limit(10)
    
    userArrayOne = [user.to_dict_all() for user in users]
    if not usersTwo == '' and usersTwo.count() > 0:
        userArrayTwo = [user.to_dict_all() for user in usersTwo]
        userArrayOne.append(userArrayTwo)
    
    return {'users': userArrayOne}
    

@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict_all()

@user_routes.route('/<int:id>', methods=['POST'])
@login_required
def update_user(id):
    first_name = request.get_json()['first_name']
    middle_name = request.get_json()['middle_name'] or ''
    last_name = request.get_json()['last_name']
    age = request.get_json()['age']
    occupation = request.get_json()['occupation'] or ''
    company_name = request.get_json()['company_name'] or ''
    work_email = request.get_json()['work_email'] or ''
    phone_number = request.get_json()['phone_number'] or ''
    
    user = User.query.get(id)
    
    user.first_name = first_name
    user.middle_name = middle_name
    user.last_name = last_name
    user.age = age
    user.occupation = occupation
    user.company_name = company_name
    user.work_email = work_email
    user.phone_number = phone_number
    
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
