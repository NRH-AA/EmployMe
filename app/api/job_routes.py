from flask import Blueprint, request
from flask_login import login_required
from app.models import db, JobListing

job_routes = Blueprint('jobs', __name__)

@job_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_job_listing(id):
    job = JobListing.query.get(id)
    
    if not job:
        return {'errors': ['Could not find job listing']}
    
    return job.to_dict()
