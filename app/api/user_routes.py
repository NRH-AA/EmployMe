from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import db, User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
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
