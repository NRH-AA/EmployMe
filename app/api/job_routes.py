from flask import Blueprint, request
from flask_login import login_required
from app.models import db, JobListing, User

job_routes = Blueprint('jobs', __name__)


@job_routes.route('', methods=['POST'])
@login_required
def create_job():
    data = request.get_json()
    user_id = data['userId']
    title = data['title']
    description = data['description']
    occupation = data['occupation']
    wage_min = data['wageMin']
    wage_max = data['wageMax']
    openings = data['openings']
    
    if not user_id or not title or not description or not occupation \
        or not openings:
            return {'errors', ['Invalid Data Sent From Client']}, 400
    
    newJob = JobListing(
         user_id = user_id,
         occupation = occupation,
         wage_min = wage_min,
         wage_max = wage_max,
         title = title,
         description = description,
         openings = openings,
         filled = 0
    )

    db.session.add(newJob)
    db.session.commit()
    return newJob.to_dict()

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
    user = User.query.get(ret.user.id)
    
    return {'job': ret.to_dict(), 'user': user.to_dict_all()}


@job_routes.route('/<int:id>/active', methods=['POST'])
@login_required
def update_job_active_status(id):
    job = JobListing.query.get(id)
    
    job.active = not job.active
    db.session.commit()
    ret = JobListing.query.get(id)
    return ret.to_dict()


@job_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_job_listing(id):
    job = JobListing.query.get(id)
    db.session.delete(job)
    db.session.commit()
    return {'success': 'Deleted Successfully'}
