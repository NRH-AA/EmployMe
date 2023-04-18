from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User

connections_routes = Blueprint('connections', __name__)


@connections_routes.route('', methods=['POST'])
@login_required
def manage_connection():
    data = request.get_json()
    connecter = int(data['connecter'])
    connecting = int(data['connecting'])
    
    print(connecter)
    print(connecting)
    
    user = User.query.get(connecter)
    if not user:
        return {'errors': ['Error getting user']}, 400
    
    other_user = User.query.get(connecting)
    if not other_user:
        return {'errors': ['Error getting user']}, 400
    
    if other_user in user.connection:
        user.connection.remove(other_user)
        db.session.commit()
        return {'message': 'success'}
    
    user.connection.append(other_user)
    db.session.commit()
    
    return {'message': 'success'}
