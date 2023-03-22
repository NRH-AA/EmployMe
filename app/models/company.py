from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User

class Company(db.Model):
    __tablename__ = 'companies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    name = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.Text)
    description = db.Column(db.Text)
    country = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    street_address = db.Column(db.String(255), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'profile_picture': self.profile_picture,
            'description': self.description,
            'country': self.country,
            'state': self.state,
            'city': self.city,
            'street_address': self.street_address,
            'zipcode': self.zipcode
        }
    