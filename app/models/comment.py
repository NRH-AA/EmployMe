from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .post import Post
from datetime import datetime


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    post_id = db.Column(db.Integer, db.ForeignKey(Post.id))
    text = db.Column(db.String(250), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now())
    
    user = db.relationship("User", back_populates="comments")
    post = db.relationship("Post", back_populates="comments")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "text": self.text,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "user": self.user.to_dict()
        }
