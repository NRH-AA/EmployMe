from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .post import Post
from datetime import datetime

class Image(db.Model):
    __tablename__ = 'images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey(Post.id))
    url = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url
        }
