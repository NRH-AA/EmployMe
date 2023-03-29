from .db import db, environment, SCHEMA
from .user import User
from datetime import datetime

class JobListing(db.Model):
    __tablename__ = 'job_listings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    occupation = db.Column(db.String(255), nullable=False)
    wage_min = db.Column(db.Integer, nullable=False)
    wage_max = db.Column(db.Integer)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    openings = db.Column(db.Integer, nullable=False)
    filled = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Boolean, default=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.now())
    
    user = db.relationship("User", back_populates="job_listings")
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'occupation': self.occupation,
            'wage': dict(
                min = self.wage_min,
                max = self.wage_max or self.wage_min
            ),
            'title': self.title,
            'description': self.description,
            'openings': self.openings,
            'filled': self.filled,
            'active': self.active,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'user': self.user.to_dict()
        }
    