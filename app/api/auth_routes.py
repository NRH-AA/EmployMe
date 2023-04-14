from flask import Blueprint, jsonify, session, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict_all()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']
    
    user = User.query.filter(User.email == email).first()
        
    if not user:
         return {'email': 'Invalid email provided'}, 401
        
    if not user.check_password(password):
        return {'password': ['Invalid password provided']}, 401
        
    login_user(user)
    return user.to_dict_all()


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    data = request.get_json()
    first_name = data['firstName']
    last_name = data['lastName']
    company_name = data['companyName']
    email = data['email']
    work_email = data['work_email']
    phone_number = data['phone_number']
    age = int(data['age'])
    username = data['username']
    password = data['password']
    confirm_password = data['confirmPassword']
    
    errors = {}

    if not first_name or len(first_name) < 4:
        errors['firstName'] = 'First name must be 4 characters or more'
        
    if not first_name or len(last_name) < 4:
        errors['lastName'] = 'Last name must be 4 characters or more'
        
    if company_name and len(company_name) < 4:
        errors['companyName'] = 'Company name must be 4 characters or more'
        
    if not email or len(email) < 4:
        errors['email'] = 'Email must be 4 characters or more'
        
    if not work_email or len(work_email) < 4 or len(work_email) > 35:
        errors['workEmail'] = 'Work Email (4-35) characters'
        
    if not phone_number or len(phone_number) != 10:
        errors['phone'] = 'Phone Number (10) characters'
        
    if not age or age < 16:
        errors['age'] = 'You must be 16 or older to join EmployMe'
        
    if not username or len(username) < 4:
        errors['username'] = 'Username must be 4 characters or more'
        
    if not password or len(password) < 4:
        errors['password'] = 'Password must be 4 characters or more'
        
    if not confirm_password or confirm_password != password:
        errors['confirm_password'] = 'Confirm password does not match'

    if len(errors) > 0:
        return {'errors': errors}, 400
    
    check_user = User.query.filter(User.email == email).first()
    
    if check_user:
        errors['emailTaken'] = 'Email is already in use'
        return {'errors': errors}, 400

    user = User(
        first_name = first_name,
        last_name = last_name,
        company_name = company_name or '',
        username = username,
        email = email,
        work_email = work_email,
        phone_number =phone_number,
        age = age,
        password = password
    )
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    return user.to_dict()


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
