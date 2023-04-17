import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";
import { setWindowPath, getSingleUser, createPost, changeTheme, changeThemeThunk } from "../../store/session";
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
    
    const sessionUser = useSelector((state) => state.session.user);
    const sessionSingleUser = useSelector(state => state.session.singleUser);
    const sessionTheme = useSelector(state => state.session.theme);
    const sessionPath = useSelector(state => state.session.path);
    
    const [theme, setTheme] = useState(sessionUser?.theme);
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    const [addPostPicture, setAddPostPicture] = useState(false);
    const [picture, setPicture] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({})
    
    const [occupation, setOccupation] = useState(sessionSingleUser?.occupation || "");
    const [company, setCompany] = useState(sessionSingleUser?.company_name || "");
    const validateBio = () => {
        const newErrors = {};
        if (occupation && occupation && (occupation.length < 4 || occupation > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (company && (company.length < 3 || company.length > 30)) newErrors.company = 'Company (3-30) characters';

        return newErrors;
    };
    
    // Update current path
    useEffect(() => {
        if (!sessionPath || !sessionPath.includes('/profile')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath]);
    
    // Update theme to match user specific theme
    useEffect(() => {
        if (theme !== sessionTheme) dispatch(changeTheme(theme));
    }, [theme])
    
    
    useEffect(() => {
        if (sessionSingleUser && (!occupation || !company)) {
            setOccupation(sessionSingleUser?.occupation);
            setCompany(sessionSingleUser?.company_name);
        }
    }, [sessionSingleUser]);
    
    // We dont have this users data. Lets go set it
    useEffect(() => {
        if (!sessionSingleUser || sessionSingleUser.id !== parseInt(userId)) dispatch(getSingleUser(parseInt(userId)));
    }, [dispatch, sessionSingleUser]);
    
    // Error validations for BIO information
    useEffect(() => {
        if (isUpdatingBio) setErrors(validateBio());
    }, [occupation, company]);
    
    
    
    if (!sessionSingleUser) return null;
    
    if (!sessionSingleUser || !sessionSingleUser.id || !sessionSingleUser?.active){
        history.push('/');
        return null;
    };
    
    const handleSubmitBio = () => {
        const newErrors = validateBio();
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
        
        if (sessionSingleUser.occupation === occupation && sessionSingleUser.company_name === company) return setIsUpdatingBio(false);
        
        const info = {
            occupation,
            company_name: company
        }
        
        dispatch(updateBioData(sessionSingleUser.id, info));
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
    
    const userSkills = sessionSingleUser?.skills?.split(';') || null;
    
    if (!sessionSingleUser?.active && isUpdatingBio) setIsUpdatingBio(!isUpdatingBio);
    
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
    
    const switchTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'blue'
        : theme === 'blue' ? 'purple' : 'light';
        dispatch(changeThemeThunk(sessionUser.id, newTheme));
		setTheme(newTheme);
	}
    
    return (
        <div id='user-profile-main-container' data-theme={sessionTheme}>
        <div id="user-profile-container">
            <div id='user-profile-top-div'>
                
                <div id='user-profile-button-div'>
                    {(sessionSingleUser?.id === sessionUser?.id) && 
                        <button id='user-profile-top-button'
                            title='Click to edit profile'
                            onClick={(e) => handleEditProfileButton(e)}
                        >{!isUpdatingBio ? <i className="fa-solid fa-ellipsis-vertical"></i> : <i className="fa fa-paper-plane"/>}
                        </button>
                    }
                </div>
                
                
                <OpenModalButton
                    className="user-profile-img-button"
                    buttonText={<img className="user-profile-img"
                        title='Click to edit profile picture'
                        src={sessionSingleUser?.profile_picture}
                        alt={sessionSingleUser?.first_name}
                    />}
                    modalComponent={<ProfilePictureModal user={sessionSingleUser}/>}
                />
                
                {!isUpdatingBio ? <h4 className='text-primary'>{sessionSingleUser?.occupation}</h4>
                : <>
                    {errors?.occupation && <p 
                        className='user-update-bio-error-p'
                    >{errors.occupation}</p>}
                    
                    <input id='user-update-bio-occupation-input'
                        title='What do you do?'
                        value={occupation}
                        maxLength={20}
                        onKeyDown={(e) => submitEnterDown(e)}
                        onChange={(e) => setOccupation(e.target.value)}
                        autoFocus
                    />
                </>}
            </div>
            
            <div id='user-profile-info-main-container'>
                <div id='user-profile-info-container'>
                    <h4 className='text-primary'>Personal Information</h4>
                    <div id='user-profile-info-div'>
                        <div>
                            <p className='text-primary'>NAME:</p>
                            <p className='text-secondary'>{sessionSingleUser?.first_name + ' ' + sessionSingleUser?.last_name}</p>
                        </div>
                            
                        <div>
                            <p className='text-primary'>EMAIL:</p>
                            <p className='text-secondary'>{sessionSingleUser?.work_email}</p>
                        </div>
                            
                        <div>
                            <p className='text-primary'>COMPANY:</p>
                            {!isUpdatingBio ? <>
                                <p className='text-secondary'>{sessionSingleUser?.company_name || 'None'}</p>
                            </> : <>
                                {errors?.company && <p 
                                    className='user-update-bio-error-p'
                                >{errors.company}</p>}
                                
                                <input id='user-update-bio-company-input'
                                    title='What company do you work for?'
                                    value={company}
                                    onKeyDown={(e) => submitTabDown(e)}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </>}
                        </div>
                            
                        <div>
                            <p className='text-primary'>PHONE:</p>
                            <p className='text-secondary'>{sessionSingleUser?.phone_number}</p>
                        </div>
                    </div>
                </div>
                
                <div id='user-profile-skills-container'>
                    <h4 className='text-primary'>Skills</h4>
                    <div id='user-profile-skills-div'>
                        {userSkills?.map((skill, i) => <p key={i} className='text-secondary'>{skill}</p>)}
                    </div>
                </div>
    
            </div>
            
            {(sessionSingleUser?.id === sessionUser?.id) && 
            <div id='user-profile-create-post-container'>
                <h4 className='text-primary'>What's on your mind?</h4>
                
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
                            onClick={(e) => removePicture(e)}
                        >X</button>
                    </div>
                : (addPostPicture) && <div className="create-post-image-div">
                    <input
                    id="create-post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateImageFile(e)}
                    />
                    
                    <button id="create-post-remove-image-button2"
                        onClick={(e) => {setPicture(''); setAddPostPicture(false)}}
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
                        onClick={(e) => setAddPostPicture(!addPostPicture)}
                    ><i className="fa-solid fa-camera"/></button>
                }
                    
                <button id='user-profile-create-post-button' className='button-main' data-theme={sessionTheme}
                    onClick={(e) => handleCreatePostSubmit(e)}
                >Create</button>
                
            </div>}
            

            <div id="user-profile-posts-container">
                {sessionSingleUser?.posts && sessionSingleUser?.posts.map(post => 
                    <Post post={post} user={sessionSingleUser}/>
                )}
            </div>
            
            <div id='user-profile-theme-button'>
                <button className='button-main'
                    onClick={() => switchTheme()}
                >Change Theme</button>
            </div>
             
        </div>
        
    </div>
    );
};

export default UserProfile;
