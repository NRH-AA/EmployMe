import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { createJobListing, updateUserInfoThunk } from "../../store/session";
import './CreateJob.css'

const CreateJobModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const sessionUser = useSelector((state) => state.session.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [occupation, setOccupation] = useState('');
    const [wageMin, setWageMin] = useState(0);
    const [wageMax, setWageMax] = useState(1);
    const [openings, setOpenings] = useState(1);
    const [errors, setErrors] = useState({});
    
    const validateForm = () => {
        const newErrors = {};
        
        if (title && (title.length < 4 || title.length > 50)) newErrors.title = 'Title (4-50) characters';
        if (description && (description.length < 10 || description.length > 300)) newErrors.description = 'Description (10-300) characters';
        if (occupation && (occupation.length < 4 || occupation.length > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (openings < 1) newErrors.openings = 'Must have 1 opening';
        
        setErrors(newErrors);
    };
    
    useEffect(() => {
        validateForm();
    }, [title, description, occupation, wageMin, wageMax, openings]);
    
    if (!sessionUser) return null;
    
    const diableCreateButton = () => !title || !description ||
                                     !occupation || wageMin < 0 ||
                                     !wageMax < 0 || !openings;

 

    const handleSubmit = async () => {
        if (Object.keys(errors).length > 0) return;
        
        if (!title) return setErrors({title: 'Title Required'});
        if (!description) return setErrors({description: 'Description Required'});
        if (!occupation) return setErrors({occupation: 'Occupation Required'});
        
        const jobData = {
            title,
            description,
            occupation,
            wageMin,
            wageMax,
            openings
        };
        
        const newJob = await dispatch(createJobListing(sessionUser.id, jobData));
        if (newJob?.id) {
            await dispatch(updateUserInfoThunk(sessionUser.id));
            return history.push(`/job/${newJob.id}`);
        };
        return;
    };
    
    return (
        <div id="create-job-container">
            <h2><u>Create Job Listing</u></h2>
            
            <div id="create-job-form-container">
                <div>
                    <p className="create-job-form-p">Title: <span>{errors?.title}</span></p>
                    <input id="create-job-title-input" type="text" value={title}
                        maxLength={50}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>
                
                <div>
                    <p className="create-job-form-p">Occupation: <span>{errors?.occupation}</span></p>
                    <input id="create-job-title-input" type="text" value={occupation}
                        maxLength={20}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </div>
                
                <div>
                    <p className="create-job-form-p">Wage: <span>{errors?.wage}</span></p>
                    
                    <div className="create-job-wage-flex">
                        <p className="create-job-form-p create-job-p-black">Min: </p>
                        <input className="create-job-wage-input" type="number" value={wageMin}
                            min={0}
                            max={wageMax}
                            onChange={(e) => setWageMin(e.target.value)}
                        />
                    </div>
                    
                    <div className="create-job-wage-flex">
                        <p className="create-job-form-p create-job-p-black">Max: </p>
                        <input className="create-job-wage-input" type="number" value={wageMax}
                            min={1}
                            max={1000}
                            onChange={(e) => setWageMax(e.target.value)}
                        />
                    </div>
            
                </div>
                
                <div id="create-job-openings-flex">
                    <p className="create-job-form-p">Openings: <span>{errors?.openings}</span></p>
                    <input className="create-job-wage-input" type="number" value={openings}
                        min={1}
                        max={100}
                        onChange={(e) => setOpenings(e.target.value)}
                    />
                </div>
                
                <div id="create-job-description-div">
                    <p className="create-job-form-p">Job Description: <span>{errors?.description}</span></p>
                    <textarea id="create-job-description-input" value={description}
                        maxLength={300}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                
                </div>
                
            </div>
            
            <div id="create-job-button-div">
                <button className="create-job-button"
                    onClick={closeModal}
                >Cancel</button>
                <button className="create-job-button"
                    onClick={() => {handleSubmit(); closeModal()}}
                    disabled={diableCreateButton()}
                >Create</button>
            </div>
            
        </div>
    );
};

export default CreateJobModal;
