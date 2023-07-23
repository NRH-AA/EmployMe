from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from datetime import datetime

class Room(db.Model):
    __tablename__ = 'rooms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    createdAt = db.Column(db.DateTime, default=datetime.now())
    updatedAt = db.Column(db.DateTime, default=datetime.now())
    
    user = db.relationship("User", back_populates="rooms")
    messages = db.relationship("Message", back_populates='room')
    
    def to_dict(self):
        return {
            "id": self.id,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            'messages': [message.to_dict() for message in self.messages]
        }
