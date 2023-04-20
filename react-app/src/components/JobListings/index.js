import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getJobListing, updateJobListing, changeJobActiveStatus, updateUserInfoThunk } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import DeleteJobModal from "./DeleteJobModal";
import './JobListing.css'


const JobListing = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [job, setJob] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [title, setTitle] = useState(job?.title || '');
    const [description, setDescription] = useState(job?.description || '');
    const [wageMin, setWageMin] = useState(job?.wage.min || 0);
    const [wageMax, setWageMax] = useState(job?.wage.max || 0);
    const [occupation, setOccupation] = useState(job?.occupation || '');
    const [openings, setOpenings] = useState(job?.openings || 0);
    const [filled, setFilled] = useState(job?.filled || 0);
    const [errors, setErrors] = useState({});
    
    const {jobId} = useParams();
    
    const getJobListingData = async () => {
        const jobListing = await dispatch(getJobListing(jobId));
        setJob({...jobListing});
    };
    
    const validateData = () => {
        const newErrors = {};
        if (title && (title.length > 50 || title.length < 4)) newErrors.title = 'Title (4-50) characters';
        if (description && (description.length < 10 || description.length > 300)) newErrors.description = 'Description (10-300) characters';
        if (occupation && (occupation.length < 4 || occupation.length > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (filled > openings) newErrors.openings = 'Falled greater than openings';
        
        setErrors(newErrors);
    }
    
    useEffect(() => {
        if (!job || jobId !== job.id) getJobListingData();
    }, [dispatch, jobId]);
    
    useEffect(() => {
        if (isUpdating) validateData()
    }, [title, description, wageMin, wageMax, occupation, filled, openings]);
    
    if (!job || !job.id || !sessionUser) return null;
    
    const populateValues = () => {
        setTitle(job.title);
        setDescription(job.description);
        setWageMin(job.wage.min);
        setWageMax(job.wage.max);
        setOccupation(job.occupation);
        setOpenings(job.openings);
        setFilled(job.filled);
    }
    
    const handleSubmit = async () => {
        if (Object.keys(errors).length > 0) return;
        
        if (!title) return setErrors({title: 'Title Required'});
        if (!description) return setErrors({description: 'Description Required'});
        if (!occupation) return setErrors({occupation: 'Occupation Required'});
        
        const data = {
            title,
            description,
            wageMin,
            wageMax,
            occupation,
            openings,
            filled
        };
        
        const jobData = await dispatch(updateJobListing(jobId, data));
        dispatch(updateUserInfoThunk(sessionUser.id));
        setJob(jobData);
        setIsUpdating(false);
    }
    
    const handleChangeActive = async () => {
        const jobData = await dispatch(changeJobActiveStatus(jobId))
        setJob(jobData)
    }
    
    const showTitle = () => {
        return !isUpdating ?
            <h2 id="job-listing-details-h2">{job?.title}</h2>
        :
            <div>
                <div>  
                    <h2 id="job-listing-edit-title">Title:</h2>
                    <span className="job-listing-error">{errors?.title}</span>
                </div>
                <input id="job-listing-edit-title-input" type="text" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={50}
                    autoFocus
                />
            </div>
    };
    
    const showOccupationWages = () => {
        return (
            <div id="job-listing-details-occupation">
                {!isUpdating ? <>
                    <p className="job-listing-details-p">Occupation: <span>{job?.occupation}</span></p>
                    <p className="job-listing-details-p">Wage: <span>{`$${job?.wage.min} - $${job?.wage.max}`}</span></p>
                </> : <>
                    <div>
                        <div>
                        <p className="job-listing-details-p">Occupation: </p>
                        <span className="job-listing-error">{errors?.occupation}</span>
                        </div>
                        <input id="job-listings-occupation-input" type="text" value={occupation}
                            maxLength={20}
                            onChange={(e) => setOccupation(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <div>
                            <p className="job-listing-details-p">Wage: </p>
                            <span className="job-listing-error">{errors?.wage}</span>
                        </div>
                        <div id="job-listing-wage-div">
                            <p>Min:</p>
                            <input className="job-listing-wage-input" type="number" value={wageMin}
                                min={0}
                                max={wageMax}
                                onChange={(e) => setWageMin(e.target.value)}
                            />
                            <p>Max:</p>
                            <input className="job-listing-wage-input" type="number" value={wageMax}
                                min={1}
                                onChange={(e) => setWageMax(e.target.value)}
                            />
                        </div>
                    </div>
                </>}
            </div>
        );
    };
    
    const showOpeningsFilled = () => {
        return (
            <div id={isUpdating ? "job-listing-openins-div" : "job-listing-openins-div-flex"}>
                <div>
                    <p className="job-listing-openings-p">Openings:</p>
                    <span className="job-listing-error">{errors?.openings}</span>
                </div>
                
                {!isUpdating ? <>
                    <p style={{fontWeight: "700"}}>{job?.openings - job?.filled}</p>
                </> : <>
                    <div className="job-listings-openings-div">
                        <p className="job-listing-openings-p">Total: </p>
                        <input className="job-listing-wage-input" type="number" value={openings}
                            min={1}
                            onChange={(e) => setOpenings(e.target.value)}
                        />
                    </div>
                    
                    <div className="job-listings-openings-div openings-div-margin">
                        <p className="job-listing-openings-p">Filled: </p>
                        <input className="job-listing-wage-input" type="number" value={filled}
                            min={0}
                            max={openings}
                            onChange={(e) => setFilled(e.target.value)}
                        />
                    </div>
                </>}
            </div>
        )
    }
    
    const showJobDescription = () => {
        return (
            <div id="job-listing-description-div">
                <div>
                    <p className="job-listing-details-p">Job Description:</p>
                    <span className="job-listing-error">{errors?.description}</span>
                </div>
                {!isUpdating ? <>
                <p id="job-listing-description-p">{job?.description}</p>
                </> : <>
                    <textarea id="job-listing-description-textarea" value={description}
                        maxLength={300}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </>}
            </div>
        );
    };
    
    const showButtons = () => {
        return (
            <div id="job-listing-edit-buttons">
                {!isUpdating ? <>
                <button className="job-listing-button"
                    onClick={() => {setIsUpdating(!isUpdating); populateValues()}}
                >Edit</button>
                <OpenModalButton
                    className="job-listing-button"
                    buttonText="Delete"
                    modalComponent={<DeleteJobModal jobId={jobId} />}
                />
                </> : <>
                <button className="job-listing-button"
                    onClick={() => {setIsUpdating(!isUpdating); setErrors({}); populateValues()}}
                >Cancel</button>
                <button className="job-listing-button"
                    onClick={handleSubmit}
                >Submit</button>
                </>}
            </div>
        );
    };
    
    
    const showJobListingInformation = () => {
        return (
            <>
            <div> 
                <img id="job-listing-image" src={job?.user?.profile_picture} alt={job?.user?.first_name}/>
                <div> 
                    <h2 id="job-listing-company-name">{job?.user?.company_name}</h2>
                    {job?.user?.id === sessionUser.id && 
                    <span id="job-listing-company-status"
                        className={job?.active ?
                            "job-active-color" : 
                            "job-inactive-color"
                        }
                        onClick={() => handleChangeActive()}
                    >Status: {job?.active ? "Active" : "Inactive"}</span>
                    }
                </div>
            </div>
            
            <div id="job-listing-details-container">
                {showTitle()}
                    
                {showOccupationWages()}
                
                {showJobDescription()}
                
                {showOpeningsFilled()}
                
                {job?.user?.id === sessionUser?.id && 
                    showButtons()
                }
            </div>
            </>
        );
    };
    
    return (
        <div id="job-listing-container">
            {showJobListingInformation()}
        </div>
    );
};

export default JobListing;
