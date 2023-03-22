from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

default_image = 'https://www.computerhope.com/jargon/g/guest-user.png'

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    work_email = db.Column(db.String(255), nullable=True, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    middle_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.Text, default=default_image)
    phone_number = db.Column(db.String(255))
    age = db.Column(db.Integer, nullable=False)
    company_name = db.Column(db.String(255))
    occupation = db.Column(db.String(255))
    jobs = db.Column(db.Text)
    education = db.Column(db.Text)
    skills = db.Column(db.Text)
    active = db.Column(db.Boolean, default=True)
    createdAt = db.Column(db.DateTime, default=datetime.now())
    updatedAt = db.Column(db.DateTime, default=datetime.now())

    posts = db.relationship("Post", back_populates="user")
    messages = db.relationship("Message")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'middle_name': self.middle_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
            'phone_number': self.phone_number,
            'age': self.age,
            'company_name': self.company_name,
            'occupation': self.occupation,
            'jobs': self.jobs,
            'education': self.education,
            'work_email': self.work_email,
            'skills': self.skills,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }

    def to_dict_all(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'middle_name': self.middle_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
            'phone_number': self.phone_number,
            'age': self.age,
            'company_name': self.company_name,
            'occupation': self.occupation,
            'jobs': self.jobs,
            'education': self.education,
            'work_email': self.work_email,
            'skills': self.skills,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'messages': [message.to_dict() for message in self.messages],
            'posts': [post.to_dict() for post in self.posts]
        }
