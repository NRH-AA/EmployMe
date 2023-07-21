from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .rooms import Room
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey(Room.id))
    sent_by = db.Column(db.Integer, db.ForeignKey(User.id))
    text = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            'roomId': self.room_id,
            'sentBy': self.sent_by.to_dict(),
            "text": self.text,
            "createdAt": self.createdAt
        }
