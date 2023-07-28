from flask import Blueprint, request
from flask_login import login_required
from app.models import db, User, Room

room_routes = Blueprint('room', __name__)

@room_routes.route('', methods=['POST'])
@login_required
def add_room():
    data = request.get_json()
    user_id = data['userId']
    
    user = User.query.get(user_id)
    
    if not user:
        return {'errors': 'Invalid user'}
    
    new_room = Room(user_id = user_id)
    db.session.add(new_room)
    db.session.commit()
    return {'success': 'User room has been added.'}

@room_routes.route('/<int:id>', methods=['POST'])
@login_required
def join_room(id):
    data = request.get_json()
    user_id = data['userId']
    
    user = User.query.get(user_id)
    
    if not user:
        return {'errors': 'Invalid user'}
    
    if user.rooms.find(id):
        return {'success': 'User joined the room'}
    
    return {'errors': 'Unable to join the room.'}
