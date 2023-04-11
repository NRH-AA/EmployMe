import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";
import { deleteUserProfileThunk, setWindowPath, getSingleUser } from "../../store/session";
import CreatePostModal from "./CreatePostModal";
import OpenModalButton from "../OpenModalButton";
import SkillsModal from "./SkillsModal";
// import EducationModal from "./EducationModal";
// import WorkHistoryModal from "./WorkHistoryModal";
// import AchievementsModal from "./AchievementsModal";
// import RecommendationsModal from "./RecommendationsModal";
import ProfilePictureModal from "./ProfilePictureModal";
import DeleteProfileModal from "./DeleteProfileModal";
import Post from './Post';
import './UserProfile.css';

const UserProfile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {userId} = useParams();
    const sessionUsers = useSelector((state) => state.session.users);
    const sessionUser = useSelector((state) => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    
    let user = null;
    
    useEffect(() => {
        if (!sessionUsers || !sessionUsers[userId]) dispatch(getSingleUser(parseInt(userId)));
    }, [dispatch, sessionUser, userId]);
    
    if (parseInt(userId) === sessionUser?.id) user = sessionUser;
    
    if (!user) {
        if (sessionUsers?.length > 0) {
            for (let el of sessionUsers) {
                if (parseInt(userId) === el.id) user = el;
            }
        } else if (sessionUsers) {
            user = sessionUsers;
        }
    }
    
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [middleName, setMiddleName] = useState(user?.middle_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [age, setAge] = useState(user?.age || 0);
    const [occupation, setOccupation] = useState(user?.occupation || "");
    const [company, setCompany] = useState(user?.company_name || "");
    const [email, setEmail] = useState(user?.work_email || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const [errors, setErrors] = useState({})
    
    const validateBio = () => {
        const newErrors = {};
        if (!firstName || firstName.length < 2 || firstName.length > 20) newErrors.firstName = 'First name (2-20) characters';
        if (middleName && middleName.length > 20) newErrors.middleName = 'Middle name (20) characters or less';
        if (!lastName || lastName.length < 2 || lastName.length > 30) newErrors.lastName = 'Last name (2-30) characters';
        if (!age || age < 16) newErrors.age = 'Age must be 16 or older'
        if (occupation && (occupation.length < 4 || occupation > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (company && (company.length < 3 || company.length > 30)) newErrors.company = 'Company (3-30) characters';
        if (email && (email.length < 5 || email.length > 30)) newErrors.email = 'Email (5-30) characters';
        if (phone && (phone.length < 10 || phone.length > 14)) newErrors.phone_number = 'Phone (10-14) characters.';
        
        return newErrors;
    };
    
    useEffect(() => {
        if (!sessionPath || !sessionPath.includes('/profile')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath])
    
    useEffect(() => {
        setErrors(validateBio());
    }, [firstName, middleName, lastName, age, occupation, company, email, phone])
    
    if (!user) {
        user = {};
        user.id = -1;
    };
    
    if (user?.id !== sessionUser?.id && !user?.active){
        return (<>
            <p>You shouldn't be here.</p>
            <button onClick={() => history.push('/')}>Go Back</button>
        </>);
    };
    
    const handleSubmitBio = (e) => {
        e.preventDefault();
        
        const newErrors = validateBio();
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
        
        if (user.first_name === firstName 
            && user.middle_name === middleName
            && user.last_name === lastName
            && user.age === age
            && user.occupation === occupation
            && user.company_name === company
            && user.work_email === email
            && user.phone_number === phone
            ) return;
        
        const info = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            age,
            occupation,
            company_name: company,
            work_email: email,
            phone_number: phone
        }
        
        dispatch(updateBioData(user.id, info));
    }
    
    const handleActivateProfile = () => {
        dispatch(deleteUserProfileThunk(user.id));
    }
    
    const userSkills = user?.skills?.split(';') || null;
    
    if (!user && !sessionUser) return null;
    
    if (!user?.active && isUpdatingBio) setIsUpdatingBio(!isUpdatingBio);
    
    return (
        <div id="user-profile-container">
            <button id='user-profile-top-button'
                
            ><i className="fa-solid fa-ellipsis-vertical"></i></button>
            
            <div id='user-profile-top-div'>
                
                <img 
                    src={user?.profile_picture}
                    alt={user?.first_name}
                />
                
                <h4>{user?.occupation}</h4>
            
                <div id='user-profile-skills-div'>
                    {userSkills?.map((skill, i) => <p key={i}>{skill}</p>)}
                </div>
            </div>
            
            <div id='user-profile-info-container'>
                <h4>Personal Information</h4>
                <div id='user-profile-info-div'>
                    <p><b>NAME:</b> <span>{user?.first_name + ' ' + user?.last_name}</span></p>
                    <p><b>EMAIL:</b> <span>{user?.work_email}</span></p>
                    <p><b>COMPANY: </b> <span>{user?.company_name || 'None'}</span></p>
                    <p><b>PHONE: </b> <span>{user?.phone_number}</span></p>
                </div>
                    
            </div>
                
            
        </div>
    );
};

export default UserProfile;
