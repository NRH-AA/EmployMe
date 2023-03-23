import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SkillsModal from "./SkillsModal";
import EducationModal from "./EducationModal";
import WorkHistoryModal from "./WorkHistoryModal";
import AchievementsModal from "./AchievementsModal";
import RecommendationsModal from "./RecommendationsModal";
import ProfilePictureModal from "./ProfilePictureModal";
import Post from './Post';
import './UserProfile.css';

const UserProfile = () => {
    const dispatch = useDispatch();
    const {userId} = useParams();
    const sessionUsers = useSelector((state) => state.session.users);
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    // const [isUpdatingSkills, setIsUpdatingSkills] = useState(false);
    // const [isUpdatingEducation, setIsUpdatingEducation] = useState(false);
    // const [isUpdatingWork, setIsUpdatingWork] = useState(false);
    // const [isUpdatingAchievements, setIsUpdatingAchievements] = useState(false);
    // const [isUpdatingRec, setIsUpdatingRec] = useState(false);
    
    let user;
    for (let el of sessionUsers) {
        console.log(el)
        if (parseInt(userId) === el.id) user = el;
    }
    
    if (!user) user = sessionUser || null;
    
    
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [middleName, setMiddleName] = useState(user?.middle_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [age, setAge] = useState(user?.age || 0);
    const [occupation, setOccupation] = useState(user?.occupation || "");
    const [company, setCompany] = useState(user?.company_name || "");
    const [email, setEmail] = useState(user?.work_email || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const [errors, setErrors] = useState({})
    
    useEffect(() => {
        setErrors(validateBio());
    }, [firstName, middleName, lastName, age, occupation, company, email, phone])
    
    if (!user) return null;
    
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
    
    return (
        <div id="user-profile-container">
            <div id="user-profile-content-container">
                <div className='user-profile-container'>
                    
                    <div id="user-profile-update-button">
                        {(user.id === sessionUser.id && 
                        !isUpdatingBio) ? 
                        <button className="user-profile-button-small"
                            onClick={() => setIsUpdatingBio(!isUpdatingBio)}
                        >Update</button> :
                        <button className="user-profile-button-small"
                            onClick={(e) => {setIsUpdatingBio(!isUpdatingBio); handleSubmitBio(e)}}
                        >Submit</button> 
                        }
                    </div>
                    
                    <div id="user-profile-bio-div">
                        <OpenModalButton
                            className="user-profile-picture-modal"
                            buttonText={<img id="user-profile-picture" src={user?.profile_picture || ""} alt={user?.first_name}/>}
                            modalComponent={<ProfilePictureModal user={user} />}
                        />
                        {isUpdatingBio && <span id="profile-picture-edit-text">Click to Update</span>}
                        <div id="user-profile-bio">
                            <div id="user-profile-bio-container">
                                {!isUpdatingBio ? <>
                                    <p className="user-profile-p"><b>Name:</b> {user?.first_name} {user?.middle_name} {user?.last_name}</p>
                                    <p className="user-profile-p"><b>Age:</b> {user?.age}</p>
                                    <p className="user-profile-p"><b>Occupation:</b> {user?.occupation}</p>
                                </> : <>
                                    <p className="user-profile-p"><b>Name:</b></p>
                                    <div id="user-profile-edit-name-div">
                                        <p className="user-profile-bio-p">{errors?.firstName && errors.firstName}</p>
                                        <input type="text" placeholder="First Name"
                                            className="user-profile-bio-input"
                                            maxLength={20}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <p className="user-profile-bio-p">{errors?.middleName && errors.middleName}</p>
                                        <input type="text" placeholder="Middle Name"
                                            className="user-profile-bio-input"
                                            maxLength={20}
                                            value={middleName}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                        />
                                        <p className="user-profile-bio-p">{errors?.lastName && errors.lastName}</p>
                                        <input type="text" placeholder="Last Name"
                                            className="user-profile-bio-input"
                                            maxLength={30}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    
                                    <p className="user-profile-p user-profile-edit-age-p"><b>Age:</b></p>
                                    <p className="user-profile-bio-p">{errors?.age && errors.age}</p>
                                    <input type="number" placeholder="Age"
                                        className="user-profile-bio-input"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                    
                                    <p className="user-profile-p user-profile-edit-age-p"><b>Occupation:</b></p>
                                    <p className="user-profile-bio-p">{errors?.occupation && errors.occupation}</p>
                                    <input type="text" placeholder="Occupation"
                                        className="user-profile-bio-input"
                                        maxLength={20}
                                        value={occupation}
                                        onChange={(e) => setOccupation(e.target.value)}
                                    />
                                </>
                                }
                            </div>
                            
                            <div>
                                {!isUpdatingBio ? <>
                                    <p><b>Company: </b> {user?.company_name}</p>
                                    <p><b>Email: </b> {user?.work_email}</p>
                                    <p><b>Phone: </b> {user?.phone_number}</p>
                                </> : <>
                                    <p className="user-profile-p user-profile-edit-age-p"><b>Company: </b></p>
                                    <p className="user-profile-bio-p">{errors?.company && errors.company}</p>
                                    <input type="text" placeholder="Company Name"
                                        className="user-profile-bio-input"
                                        maxLength={30}
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                    
                                    <p className="user-profile-p user-profile-edit-age-p"><b>Email: </b></p>
                                    <p className="user-profile-bio-p">{errors?.email && errors.email}</p>
                                    <input type="text" placeholder="Work Email"
                                        className="user-profile-bio-input"
                                        maxLength={30}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    
                                    <p className="user-profile-p user-profile-edit-age-p"><b>Phone: </b></p>
                                    <p className="user-profile-bio-p">{errors?.phone_number && errors.phone_number}</p>
                                    <input type="text" placeholder="Phone Number"
                                        className="user-profile-bio-input"
                                        maxLength={14}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </>}
                            </div>
                            
                        </div>
                    </div>
                    
                    
                    <div id="user-profile-bottom-div">
                        <div id="user-profile-qualifications">
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification">
                                    <p className="user-qualifications-p">SKILLS</p>
                                    {user.id === sessionUser.id && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<SkillsModal user={user} />}
                                    />}
                                </div>
                                
                                {user?.skills && user.skills}
                            </div>
                            
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification">
                                    <p className="user-qualifications-p">EDUCATION</p>
                                    {user.id === sessionUser.id && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<EducationModal user={user} />}
                                    />}
                                </div>
                            </div>
                            
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification"> 
                                    <p className="user-qualifications-p">WORK HIST.</p>
                                    {user.id === sessionUser.id && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<WorkHistoryModal user={user} />}
                                    />}
                                </div>
                            </div>
                            
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification">
                                    <p className="user-qualifications-p">ACHIEV.</p>
                                    {user.id === sessionUser.id && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<AchievementsModal user={user} />}
                                    />}
                                </div>
                            </div>
                            
                            <div className="user-profile-qualifications-container">
                                <div className="user-profile-qualification">
                                    <p className="user-qualifications-p">REC.</p>
                                    {user.id === sessionUser.id && <OpenModalButton
                                        className="user-profile-button-small"
                                        buttonText="Update"
                                        modalComponent={<RecommendationsModal user={user} />}
                                    />}
                                </div>
                            </div>
                            
                        </div>
                            
                        <div id="user-profile-posts-div">
                            {user?.posts?.map(post => <Post post={post}/>)}
                        </div>
                    
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default UserProfile;
