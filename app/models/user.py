from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

default_image = 'https://www.computerhope.com/jargon/g/guest-user.png'
cover_image = 'https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg'

connections = db.Table(
    "connections",
    db.Model.metadata,
    db.Column('connecter', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('connecty', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True)
)

follows = db.Table(
    "follows",
    db.Model.metadata,
    db.Column('follower', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('followed', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True)
)

likes = db.Table(
    'likes',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey(
        add_prefix_for_prod('posts.id')), primary_key=True)
)

room_invites = db.Table(
    "room_invites",
    db.Model.metadata,
    db.Column('owner', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('participant', db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), primary_key=True)
)

if environment == 'production':
    connections.schema = SCHEMA
    follows.schema = SCHEMA
    likes.schema = SCHEMA
    room_invites.schema = SCHEMA

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
    cover_image = db.Column(db.Text, default=cover_image)
    profile_picture = db.Column(db.Text, default=default_image)
    phone_number = db.Column(db.String(255))
    age = db.Column(db.Integer, nullable=False)
    company_name = db.Column(db.String(255))
    occupation = db.Column(db.String(255))
    bio = db.Column(db.String(255))
    jobs = db.Column(db.Text)
    education = db.Column(db.Text)
    skills = db.Column(db.Text)
    active = db.Column(db.Boolean, default=True)
    theme = db.Column(db.String(255), default='light')
    createdAt = db.Column(db.DateTime, default=datetime.now())
    updatedAt = db.Column(db.DateTime, default=datetime.now())

    posts = db.relationship("Post", back_populates="user")
    comments = db.relationship("Comment", back_populates="user")
    job_listings = db.relationship("JobListing", back_populates="user")
    images = db.relationship("UserImage")
    rooms = db.relationship("Room", back_populates='user')
    
    connection = db.relationship(
        "User",
        secondary="connections",
        primaryjoin=connections.c.connecty == id,
        secondaryjoin=connections.c.connecter == id,
        backref="connecting"
    )
    followers = db.relationship(
        "User",
        secondary="follows",
        primaryjoin=follows.c.followed == id,
        secondaryjoin=follows.c.follower == id,
        backref="following"
    )
    liked_posts = db.relationship(
        "Post",
        secondary="likes",
        back_populates="user_likes"
    )
    room_invites = db.relationship(
        'User',
        secondary='room_invites',
        primaryjoin=room_invites.c.owner == id,
        secondaryjoin=room_invites.c.participant == id,
        backref='rooms_invited'
    )


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
            'bio': self.bio,
            'jobs': self.jobs,
            'education': self.education,
            'work_email': self.work_email,
            'skills': self.skills,
            'active': self.active,
            'theme': self.theme,
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
            'bio': self.bio,
            'jobs': self.jobs,
            'education': self.education,
            'work_email': self.work_email,
            'skills': self.skills,
            'active': self.active,
            'theme': self.theme,
            'rooms': self.rooms,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'job_listings': [job.to_dict() for job in self.job_listings],
            'images': [image.to_dict() for image in self.images],
            'rooms': [room.to_dict() for room in self.rooms],
            'room_invites': [room_invite.to_dict() for room_invite in self.room_invites],
            'posts': [post.to_dict() for post in self.posts],
            'comments': [comment.to_dict() for comment in self.comments],
            'liked_posts': [post.to_dict() for post in self.liked_posts],
            'connections': [user.to_dict() for user in self.connection],
            'connecting': [user.to_dict() for user in self.connecting],
            'followers': [user.to_dict() for user in self.followers],
            'following': [user.to_dict() for user in self.following]
        }
