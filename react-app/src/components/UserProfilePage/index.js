import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";
import { setWindowPath, getSingleUser, createPost } from "../../store/session";
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
    const [addPostPicture, setAddPostPicture] = useState(false);
    const [picture, setPicture] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({})
    
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
    
    const [occupation, setOccupation] = useState(user?.occupation || "");
    const [company, setCompany] = useState(user?.company_name || "");
    
    const validateBio = () => {
        const newErrors = {};
        if (occupation && occupation && (occupation.length < 4 || occupation > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (company && (company.length < 3 || company.length > 30)) newErrors.company = 'Company (3-30) characters';

        return newErrors;
    };
    
    useEffect(() => {
        if (!sessionPath || !sessionPath.includes('/profile')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath])
    
    useEffect(() => {
        setErrors(validateBio());
    }, [occupation, company])
    
    if (!user) {
        user = {};
        user.id = -1;
    };
    
    if (user?.id !== sessionUser?.id && !user?.active){
        return history.push('/');
    };
    
    const handleSubmitBio = () => {
        const newErrors = validateBio();
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
        
        if (user.occupation === occupation && user.company_name === company) return setIsUpdatingBio(false);
        
        const info = {
            occupation,
            company_name: company
        }
        
        dispatch(updateBioData(user.id, info));
        setIsUpdatingBio(false);
    }
    
    const validatePostInformation = () => {
        const newErrors = {};
        
        if (!description) newErrors.description = 'Descripton is required';
        else if (description.length < 10) newErrors.description = 'Description (10-250)';
        
        return newErrors;
    }
    
    const handleCreatePostSubmit = () => {
        const newErrors = validatePostInformation();
        if (Object.values(newErrors).length > 0) return setErrors(newErrors);
        
        if (!description) return setErrors(['Title and text are required.']);
        
        const urls = [];
        if (picture) urls.push(picture);
        
        const postData = {
            userId: sessionUser.id,
            title,
            text: description,
            urls
        }
        
        dispatch(createPost(postData));
        setTitle('');
        setDescription('');
        setPicture('');
        setAddPostPicture(false);
    }
    
    
    const handleFetch = async (formData) => {
        const res = await fetch('/api/users/upload', {
            method: "POST",
            body: formData,
        });
        
        if (res.ok) {
            const data = await res.json();
            const imageUrl = data.url;
    
            if (!imageUrl) return setErrors(["Failed to upload image. Please try again."]);
            return imageUrl;
        }
        return false;
    }
    
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
    
        const url = await handleFetch(formData);
        if (!url) return setErrors(['Failed to get image url']);
        
        return setPicture(url);
    };
    
    
    const updateImageFile = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
    };
    
    
    const removePicture = () => {
        setPicture('');
    }
    
    const userSkills = user?.skills?.split(';') || null;
    
    if (!user && !sessionUser) return null;
    
    if (!user?.active && isUpdatingBio) setIsUpdatingBio(!isUpdatingBio);
    
    const handleEditProfileButton = () => {
        if (!isUpdatingBio) return setIsUpdatingBio(true);
        else return handleSubmitBio()
    }
    
    const submitEnterDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (errors.length > 0) return;
            return handleSubmitBio()
        }
    }
    
    const submitTabDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            if (errors.length > 0) return;
            return handleSubmitBio()
        }
    }
    
    return (
        <div id="user-profile-container">
            <div id='user-profile-top-div'>
                
                <div id='user-profile-button-div'>
                    {(user?.id === sessionUser?.id) && 
                        <button id='user-profile-top-button'
                            title='Click to edit profile'
                            onClick={() => handleEditProfileButton()}
                        >{!isUpdatingBio ? <i className="fa-solid fa-ellipsis-vertical"></i> : <i className="fa fa-paper-plane"/>}
                        </button>
                    }
                </div>
                
                
                <OpenModalButton
                    className="user-profile-img-button"
                    buttonText={<img className="user-profile-img"
                        title='Click to edit profile picture'
                        src={user?.profile_picture}
                        alt={user?.first_name}
                    />}
                    modalComponent={<ProfilePictureModal user={user}/>}
                />
                
                {!isUpdatingBio ? <h4>{user?.occupation}</h4>
                : <>
                    {errors?.occupation && <p 
                        className='user-update-bio-error-p'
                    >{errors.occupation}</p>}
                    
                    <input id='user-update-bio-occupation-input'
                        title='What do you do?'
                        value={occupation}
                        maxLength={20}
                        onKeyDown={submitEnterDown}
                        onChange={(e) => setOccupation(e.target.value)}
                        autoFocus
                    />
                </>}
            </div>
            
            <div id='user-profile-info-main-container'>
                <div id='user-profile-info-container'>
                    <h4>Personal Information</h4>
                    <div id='user-profile-info-div'>
                        <div>
                            <p>NAME:</p>
                            <p>{user?.first_name + ' ' + user?.last_name}</p>
                        </div>
                            
                        <div>
                            <p>EMAIL:</p>
                            <p>{user?.work_email}</p>
                        </div>
                            
                        <div>
                            <p>COMPANY:</p>
                            {!isUpdatingBio ? <>
                                <p>{user?.company_name || 'None'}</p>
                            </> : <>
                                {errors?.company && <p 
                                    className='user-update-bio-error-p'
                                >{errors.company}</p>}
                                
                                <input id='user-update-bio-company-input'
                                    title='What company do you work for?'
                                    value={company}
                                    onKeyDown={submitTabDown}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </>}
                        </div>
                            
                        <div>
                            <p>PHONE:</p>
                            <p>{user?.phone_number}</p>
                        </div>
                    </div>
                </div>
                
                <div id='user-profile-skills-container'>
                    <h4>Skills</h4>
                    <div id='user-profile-skills-div'>
                        {userSkills?.map((skill, i) => <p key={i}>{skill}</p>)}
                    </div>
                </div>
    
            </div>
            
            {(user?.id === sessionUser?.id) && <div id='user-profile-create-post-container'>
                <h4>What's on your mind?</h4>
                
                <input id='user-profile-create-post-title'
                    placeholder='Title (Not Required)'
                    maxLength={40}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
                
                {(addPostPicture && picture) ? 
                    <div className="create-post-image-div">
                        <img id="create-post-image"
                            src={picture} 
                            alt="PostImage"
                        />
                        
                        <button id="create-post-remove-image-button"
                            onClick={() => removePicture()}
                        >X</button>
                    </div>
                : (addPostPicture) && <div className="create-post-image-div">
                    <input
                    id="create-post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={updateImageFile}
                    />
                    
                    <button id="create-post-remove-image-button2"
                        onClick={() => {setPicture(''); setAddPostPicture(false)}}
                    >X</button>
                </div>
                }
                
                {errors?.description && 
                    <p className='create-post-errors-p'>{errors.description}</p>
                }
                <textarea id='user-profile-create-post-textarea' 
                    placeholder="What would you like to say?"
                    maxLength={250}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                
                {!addPostPicture && 
                    <button className='user-profile-add-post-img-button'
                        title='Add an image'
                        onClick={() => setAddPostPicture(!addPostPicture)}
                    ><i className="fa-solid fa-camera"/></button>
                }
                    
                <button id='user-profile-create-post-button'
                    onClick={handleCreatePostSubmit}
                >Create</button>
                
            </div>}
            
            {(user?.id === sessionUser?.id) && 
                <div id="user-profile-posts-container">
                    {user?.posts && user?.posts.map(post => 
                        <Post post={post} user={user}/>
                    )}
                </div>
            }
            
        </div>
    );
};

export default UserProfile;
