import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";
import { deleteUserProfileThunk } from "../../store/session";
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
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    
    let user = null;
    
    if (parseInt(userId) === sessionUser?.id) user = sessionUser;
    
    if (!user) {
        if (sessionUsers) {
            for (let el of sessionUsers) {
                if (parseInt(userId) === el.id) user = el;
            }
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
    
    const showInvalidFeature = () => {
        alert('Feature coming soon!');
    }
    
    const userSkills = user?.skills?.split(';') || null;
    
    if (!user && !sessionUser) return null;
    
    
    const showProfileEditButtons = () => {
        return (
            <div id="user-profile-update-button">
                <div id="user-profile-update-buttons-div">
                    {user?.active && (user?.id === sessionUser?.id && !isUpdatingBio) ? 
                    <button className="user-profile-button-small"
                        onClick={() => setIsUpdatingBio(!isUpdatingBio)}
                    >Update</button> 
                    : (user?.active && user?.id === sessionUser?.id) &&
                    
                    <button className="user-profile-button-small"
                        onClick={(e) => {setIsUpdatingBio(!isUpdatingBio); handleSubmitBio(e)}}
                    >Submit</button> 
                    }
                    
                    {(user?.id === sessionUser?.id && !isUpdatingBio && user?.active) ?
                    <OpenModalButton
                        className="user-profile-button-small"
                        buttonText="Delete"
                        modalComponent={<DeleteProfileModal user={user} />}
                    />
                    : (user?.id === sessionUser?.id) &&
                    <button className="user-profile-button-small user-profile-activate-button"
                        onClick={() => handleActivateProfile()}
                    >Activate</button>
                    }
                </div>
                
                <div id="user-profile-create-post-div">
                {user?.id === sessionUser?.id &&
                    <p id={user?.active ? "user-profile-status-p" : "user-profile-status-p-inactive"}>
                        Status: {user?.active ? "Active" : "Inactive"}
                    </p>
                }
                
                {(user?.active && user?.id === sessionUser?.id) &&
                <OpenModalButton
                    className="user-profile-button-small profile-create-post-button"
                    buttonText="Create Post"
                    modalComponent={<CreatePostModal/>}
                />
                }
                </div>
            </div>
        );
    };
    
    const showUserBio = () => {
        return (
            <div id="user-profile-bio-div">
                <OpenModalButton
                    className="user-profile-picture-modal"
                    buttonText={<img id="user-profile-picture" src={user?.profile_picture || ""} alt={user?.first_name}/>}
                    modalComponent={<ProfilePictureModal user={user} />}
                />
                
                {isUpdatingBio && <span id="profile-picture-edit-text">Click to Update</span>}
                <div id="user-profile-bio">
                    <div>
                        {!isUpdatingBio ? <>
                            <p className="user-profile-p">Name: <span className="user-profile-bio-span">{user?.first_name} {user?.middle_name} {user?.last_name}</span></p>
                            <p className="user-profile-p">Age: <span className="user-profile-bio-span">{user?.age}</span></p>
                            <p className="user-profile-p">Occupation: <span className="user-profile-bio-span">{user?.occupation}</span></p>
                        </> : <>
                            <p className="user-profile-p">Name:</p>
                            <div id="user-profile-edit-name-div">
                                <p className="user-profile-bio-p">{errors?.firstName && errors.firstName}</p>
                                <input type="text" placeholder="First Name"
                                    className="user-profile-bio-input login-input"
                                    maxLength={20}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                
                                <p className="user-profile-bio-p">{errors?.middleName && errors.middleName}</p>
                                <input type="text" placeholder="Middle Name"
                                    className="user-profile-bio-input login-input"
                                    maxLength={20}
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                 />
                                 
                                <p className="user-profile-bio-p">{errors?.lastName && errors.lastName}</p>
                                <input type="text" placeholder="Last Name"
                                    className="user-profile-bio-input login-input"
                                    maxLength={30}
                                    value={lastName}
                                     onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                                    
                            <p className="user-profile-p user-profile-edit-age-p">Age:</p>
                            <p className="user-profile-bio-p">{errors?.age && errors.age}</p>
                            <input type="number" placeholder="Age"
                                className="user-profile-bio-input login-input"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                                    
                            <p className="user-profile-p user-profile-edit-age-p">Occupation:</p>
                            <p className="user-profile-bio-p">{errors?.occupation && errors.occupation}</p>
                            <input type="text" placeholder="Occupation"
                                className="user-profile-bio-input login-input"
                                maxLength={20}
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                            
                        </>}
                    </div>
                            
                    <div>
                    {!isUpdatingBio ? <>
                        <p className="user-profile-p">Company: <span className="user-profile-bio-span">{user?.company_name}</span></p>
                        <p className="user-profile-p">Email: <span className="user-profile-bio-span">{user?.work_email}</span></p>
                        <p className="user-profile-p">Phone: <span className="user-profile-bio-span">{user?.phone_number}</span></p>
                    </> : <>
                        <p className="user-profile-p user-profile-edit-age-p">Company:</p>
                        <p className="user-profile-bio-p">{errors?.company && errors.company}</p>
                        <input type="text" placeholder="Company Name"
                            className="user-profile-bio-input login-input"
                            maxLength={30}
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                                    
                        <p className="user-profile-p user-profile-edit-age-p">Email:</p>
                        <p className="user-profile-bio-p">{errors?.email && errors.email}</p>
                        <input type="text" placeholder="Work Email"
                            className="user-profile-bio-input login-input"
                            maxLength={30}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                                    
                        <p className="user-profile-p user-profile-edit-age-p">Phone:</p>
                        <p className="user-profile-bio-p">{errors?.phone_number && errors.phone_number}</p>
                        <input type="text" placeholder="Phone Number"
                            className="user-profile-bio-input login-input"
                            maxLength={14}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </>}
                    </div>          
                </div>
                
                {showProfileEditButtons()} 
            </div>
        );
    };
    
    return (
        <div id="user-profile-container">
            <div id="user-profile-content-container">
                <div className='user-profile-container'>
                    
                    {showUserBio()}
                    
                    <div id="user-profile-bottom-div">
                        <div id="user-profile-qualifications">
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification">
                                    <p className="user-qualifications-p">SKILLS</p>
                                    {(user?.active && user?.id === sessionUser?.id) && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<SkillsModal user={user} />}
                                    />}
                                </div>
                                
                                <div id="user-profile-skills-div">
                                    {userSkills?.length > 0 && userSkills?.map((el, i) => 
                                        <p className="user-skills-p" key={i}>{el}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Add Education, ect here */}
                        </div>
                            
                        <div id="user-profile-posts-div">
                            {user?.posts?.map(post => <Post key={post.id} post={post} user={user}/>)}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
