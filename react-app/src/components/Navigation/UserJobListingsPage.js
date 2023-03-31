import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import './UserJobListings.css';

const UserJobListingsPage = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    
    return (
        <div id="user-job-listings-container">
            
            <div id="user-job-listings-main-div"> 
                {sessionUser?.job_listings?.map(job => 
                <NavLink to={`/job/${job.id}`} className="user-job-listings-navlink"
                    onClick={closeModal}
                >
                    <div className="user-job-listings-job-container">
                        <h2>{job.title}</h2>
                        <div className="user-job-listings-info-flex">
                            <p className="user-job-listings-info-p">Occupation: <span>{job.occupation}</span></p>
                            <p className="user-job-listings-info-p">Openings: <span>{job.openings - job.filled}</span></p>
                        </div>
                    </div>
                </NavLink>
                )}
            </div>
            
        </div>
    );
};

export default UserJobListingsPage;
