import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteJobListing } from "../../store/session";
import './CreateJob.css'

const CreateJobModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [occupation, setOccupation] = useState('');
    const [wageMin, setWageMin] = useState('');
    const [wageMax, setWageMax] = useState('');
    const [openings, setOpenings] = useState('');
    const [errors, setErrors] = useState({});
    
    const validateForm = () => {
        const newErrors = {};
        
        setErrors(newErrors);
    };
    
    useEffect(() => {
        validateForm();
    }, [title, description, occupation, wageMin, wageMax, openings]);
    
    
    return (
        <div id="create-job-container">
            <h2><u>Create Job Listing</u></h2>
            
            <div id="create-job-form-container">
                <div>
                    <p className="create-job-form-p">Title: <span>{errors?.title}</span></p>
                    <input id="create-job-title-input" type="text" value={title}
                        maxLength={50}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                
                <div>
                    <p className="create-job-form-p">Occupation: <span>{errors?.occupation}</span></p>
                    <input id="create-job-title-input" type="text" value={occupation}
                        maxLength={20}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </div>
                
                
            </div>
            
        </div>
    );
};

export default CreateJobModal;
