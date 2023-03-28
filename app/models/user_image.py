from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User

class UserImage(db.Model):
    __tablename__ = 'user_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'url': self.url
        }
