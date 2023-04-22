from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from datetime import datetime

class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    post_text = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now())

    user = db.relationship("User", back_populates="posts")
    comments = db.relationship("Comment", back_populates="post")
    images = db.relationship("PostImage", cascade='all, delete-orphan')
    
    user_likes = db.relationship(
        "User",
        secondary = "likes",
        back_populates = "liked_posts"
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_text": self.post_text,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "user": self.user.to_dict(),
            'images': [image.to_dict() for image in self.images],
            'user_likes': [user.to_dict() for user in self.user_likes]
        }
