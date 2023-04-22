import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { updateBioData } from "../../store/session";
import { useParams } from "react-router-dom";

import { getSingleUser, createPost, 
        changeTheme, changeThemeThunk, 
        updateUserInfoThunk 
} from "../../store/session";

import OpenModalButton from "../OpenModalButton";
import ProfilePictureModal from "./ProfilePictureModal";
import Post from './Post';
import './UserProfile.css';

const UserProfile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {userId} = useParams();
    
    const sessionUser = useSelector((state) => state.session.user);
    const sessionSingleUser = useSelector(state => state.session.singleUser);
    const sessionTheme = useSelector(state => state.session.theme);
    
    const [theme, setTheme] = useState(sessionUser?.theme);
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    const [addPostPicture, setAddPostPicture] = useState(false);
    const [picture, setPicture] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({})
    
    const [bio, setBio] = useState(sessionSingleUser?.bio || '');
    const [occupation, setOccupation] = useState(sessionSingleUser?.occupation || "");
    const [company, setCompany] = useState(sessionSingleUser?.company_name || "");
    
    const hasConnection = () => {
        const connections = sessionUser?.connections;
        if (!connections) return false;
        for (const conn of connections) {
            if (conn.id === sessionSingleUser?.id) return true;
        }
        return false;
    }
    const [connected, setConnected] = useState(hasConnection());
    
    const validateBio = () => {
        const newErrors = {};
        if (occupation && occupation && (occupation.length < 4 || occupation > 20)) newErrors.occupation = 'Occupation (4-20) characters';
        if (company && (company.length < 3 || company.length > 30)) newErrors.company = 'Company (3-30) characters';

        return newErrors;
    };
    
    useEffect(() => {
        setConnected(hasConnection());
    }, [sessionUser, sessionSingleUser])
    
    // Update theme to match user specific theme
    useEffect(() => {
        if (theme !== sessionTheme) dispatch(changeTheme(theme));
    }, [dispatch, theme, sessionTheme])
    
    
    useEffect(() => {
        if (sessionUser?.id === sessionSingleUser?.id) {
            if (sessionUser && (!occupation || !company)) {
                setOccupation(sessionUser?.occupation);
                setCompany(sessionUser?.company_name);
                setBio(sessionUser?.bio);
            }
        }
    }, [sessionUser, sessionSingleUser, occupation, company]);
    
    // We dont have this users data. Lets go set it
    useEffect(() => {
        if (!sessionSingleUser || sessionSingleUser.id !== parseInt(userId)) dispatch(getSingleUser(parseInt(userId)));
    }, [dispatch, sessionSingleUser, userId]);
    
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
        
        if (sessionSingleUser.occupation === occupation && 
            sessionSingleUser.company_name === company && 
            sessionSingleUser.bio === bio) return setIsUpdatingBio(false);
        
        const info = {
            occupation,
            bio,
            company_name: company
        }
        
        dispatch(updateBioData(sessionSingleUser.id, info));
        setIsUpdatingBio(false);
    }
    
    
    
    const validatePostInformation = () => {
        const newErrors = {};
        
        if (!description) newErrors.description = 'Descripton is required';
        else if (description.length < 10) newErrors.description = 'Description (10-1000)';
        
        return newErrors;
    }
    
    
    
    const handleCreatePostSubmit = () => {
        if (sessionUser?.id === 1) return alert('Demo user cannot create posts.');
        
        const newErrors = validatePostInformation();
        if (Object.values(newErrors).length > 0) return setErrors(newErrors);
        
        if (!description) return setErrors(['Title and text are required.']);
        
        const urls = [];
        if (picture) urls.push(picture);
        
        const postData = {
            userId: sessionUser.id,
            text: description,
            urls
        }
        
        dispatch(createPost(postData));
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
        if (sessionUser?.id === 1) return alert('Demo user cannot upload files.');
        const formData = new FormData();
        formData.append("image", file);
    
        const url = await handleFetch(formData);
        if (!url) return setErrors(['Failed to get image url']);
        
        return setPicture(url);
    };
    
    
    
    const updateImageFile = (e) => {
        if (sessionUser?.id === 1) return alert('Demo user cannot upload files.');
        const file = e.target.files[0];
        handleImageUpload(file);
    };
    
    
    
    const removePicture = () => {
        setPicture('');
    }
    
    const userSkills = sessionSingleUser?.skills?.split(';') || null;
    
    if (!sessionSingleUser?.active && isUpdatingBio) setIsUpdatingBio(!isUpdatingBio);
    
    const handleEditProfileButton = () => {
        if (sessionUser?.id === 1) return alert('Demo account cannot be modified.');
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
    
    const handleConnection = async () => {
        if (sessionUser?.id === sessionSingleUser?.id) return;
        
        const ret = await fetch(`/api/connections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                connecter: sessionUser.id,
                connecting: sessionSingleUser.id
            })
        });
        
        if (ret.ok) {
            await dispatch(updateUserInfoThunk(sessionUser.id));
            await dispatch(getSingleUser(sessionSingleUser.id));
            return;
        }
        
        alert('There was an error connecting. Please try again.');
    }
    
    const showUserProfileTop = () => {
        return (<>
            <div id='user-profile-button-div'>
                {(sessionSingleUser?.id === sessionUser?.id) && 
                    <button id='user-profile-top-button'
                        title='Click to edit profile'
                        onClick={(e) => handleEditProfileButton(e)}
                    >{!isUpdatingBio ? <i className="fa-solid fa-ellipsis-vertical"></i> : <i className="fa fa-paper-plane user-profile-paper-plane"/>}
                    </button>
                }
            </div>
                
                
            {(sessionSingleUser?.id === sessionUser?.id) ? 
                <OpenModalButton className="user-profile-img-button"
                    buttonText={<img className="user-profile-img"
                        title='Click to edit profile picture'
                        src={sessionSingleUser?.profile_picture}
                        alt={sessionSingleUser?.first_name}
                    />}
                    modalComponent={<ProfilePictureModal user={sessionSingleUser}/>}
                />
            :
                <NavLink to={{pathname: sessionSingleUser?.profile_picture}} target='_blank'>
                    <img style={{marginBottom: "10px"}}className="user-profile-img"
                        title='Click to edit profile picture'
                        src={sessionSingleUser?.profile_picture}
                        alt={sessionSingleUser?.first_name}
                    />
                </NavLink>
            }
                
            
            <h4 className='text-primary'>{sessionSingleUser?.first_name + ' ' + sessionSingleUser?.last_name}</h4>
            {!isUpdatingBio ? <>
                <p className='text-secondary user-profile-occupation-p'>{sessionSingleUser?.bio}</p>
                {(sessionUser?.id !== sessionSingleUser?.id) &&
                    <button className='button-main'
                        onClick={() => handleConnection()}
                    >{!connected ? 'Connect' : 'Remove Connection'} </button>
                }
            </> : <>
                {errors?.bio && <p 
                    className='user-update-bio-error-p'
                >{errors.bio}</p>}

                <textarea id='user-update-bio-textarea'
                    title='bio'
                    placeholder='A short bio to sum up who you are'
                    value={bio}
                    maxLength={120}
                    onKeyDown={(e) => submitEnterDown(e)}
                    onChange={(e) => setBio(e.target.value)}
                    autoFocus
                />
            </>}
        </>);
    };
    
    
    return (
        <div id='user-profile-main-container' data-theme={sessionTheme}>
        <div id="user-profile-container">
            
            <div id='user-profile-top-div'>
                {showUserProfileTop()}
            </div>
            
            <div id='user-profile-info-main-container'>
                <div id='user-profile-info-container'>
                    <h4 className='text-primary'>Personal Information</h4>
                    <div id='user-profile-info-div'>
                        <div>
                            <p className='text-primary'>Occupation:</p>
                            
                            {!isUpdatingBio ?
                                <p className='text-secondary'>{sessionSingleUser?.occupation || 'Unset'}</p>
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
                                />
                            </>}
                            
                        </div>
                        
                        <div>
                            <p className='text-primary'>Work Email:</p>
                            <p className='text-secondary'>{sessionSingleUser?.work_email}</p>
                        </div>
                            
                        <div>
                            <p className='text-primary'>Company:</p>
                            {!isUpdatingBio ?
                                <p className='text-secondary'>{sessionSingleUser?.company_name || 'None'}</p>
                            : <>
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
                            <p className='text-primary'>Phone:</p>
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
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                
                {!addPostPicture && 
                    <button className='user-profile-add-post-img-button'
                        title='Add an image'
                        onClick={(e) => setAddPostPicture(!addPostPicture)}
                    ><i className="fa-solid fa-camera"/></button>
                }
                    
                <button id='user-profile-create-post-button'
                    title='Create Post'
                    onClick={(e) => handleCreatePostSubmit(e)}
                ><i className="fa-solid fa-pen-to-square"/></button>
                
            </div>}
            

            <div id="user-profile-posts-container">
                {sessionSingleUser?.posts && sessionSingleUser?.posts.map((post, i) => 
                    <Post key={i} post={post} user={sessionSingleUser}/>
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
