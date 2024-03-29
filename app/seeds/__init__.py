from flask.cli import AppGroup
from .users import seed_users, undo_users
from .posts import seed_posts, undo_posts
from .post_images import seed_post_images, undo_post_images
from .post_comments import seed_post_comments, undo_post_comments
from .rooms import seed_rooms, undo_rooms
from .messages import seed_messages, undo_messages

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_messages()
        undo_rooms()
        undo_post_comments()
        undo_post_images()
        undo_posts()
        undo_users()
    seed_users()
    seed_posts()
    seed_post_images()
    seed_post_comments()
    seed_rooms()
    seed_messages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_messages()
    undo_rooms()
    undo_post_comments()
    undo_post_images()
    undo_posts()
    undo_users()
    # Add other undo functions here
