import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getJobListing } from "../../store/session";
import './JobListing.css'


const JobListing = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [job, setJob] = useState(null);
    
    const {jobId} = useParams();
    
    const getJobListingData = async () => {
        const jobListing = await dispatch(getJobListing(jobId));
        setJob(jobListing)
    }
    
    useEffect(() => {
        if (!job) getJobListingData();
    }, [dispatch])
    
    if (!job || !sessionUser) return null;
    
    return (
        <div id="job-listing-container">
            <div> 
                <img id="job-listing-image" src={job?.user?.profile_picture} alt={job?.user?.first_name}/>
                <h2 id="job-listing-company-name">{job?.user?.company_name}</h2>
            </div>
            
            <div id="job-listing-details-container">
                <h2 id="job-listing-details-h2">{job?.title}</h2>
                    
                <div id="job-listing-details-occupation">
                    <p className="job-listing-details-p">Occupation: <span>{job?.occupation}</span></p>
                    <p className="job-listing-details-p">Wage: <span>{`$${job?.wage.min} - $${job?.wage.max}`}</span></p>
                </div>
                
            </div>
        
        </div>
    );
};

export default JobListing;
