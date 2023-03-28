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


@job_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_job_listing(id):
    data = request.get_json()
    title = data['title']
    description = data['description']
    wage_min = data['wageMin']
    wage_max = data['wageMax']
    occupation = data['occupation']
    openings = data['openings']
    filled = data['filled']
    
    job = JobListing.query.get(id)
    
    if not job:
        return {'errors': ['Could not find job listing']}
    
    job.title = title
    job.description = description
    job.wage_min = wage_min
    job.wage_max = wage_max
    job.occupation = occupation
    job.openings = openings
    job.filled = filled
    
    db.session.commit()
    ret = JobListing.query.get(id)
    return ret.to_dict()


@job_routes.route('/<int:id>/active', methods=['POST'])
@login_required
def update_job_active_status(id):
    job = JobListing.query.get(id)
    
    job.active = not job.active
    db.session.commit()
    ret = JobListing.query.get(id)
    return ret.to_dict()
