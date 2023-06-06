from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_from = db.Column(db.Integer, db.ForeignKey(User.id))
    user_to = db.Column(db.Integer)
    text = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now())
    updatedAt = db.Column(db.DateTime, default=datetime.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_from": self.user_from.to_dict(),
            "user_to": self.user_to,
            "text": self.text,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }
