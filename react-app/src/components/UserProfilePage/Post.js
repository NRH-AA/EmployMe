import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updatePost } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import DeletePostModal from "./DeletePostModal";
import './Post.css';


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionSingleUser = useSelector(state => state.session.singleUser);
    const sessionTheme = useSelector(state => state.session.theme);
    
    const default_picture = 'https://assets.website-files.com/61e2d9500e1bc451a3ea1aa3/629a49e7ab53625cb2c4e791_Brand-pattern.jpg';
    
    const [pictures, setPictures] = useState(post?.images);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showImage, setShowImage] = useState(post?.images?.[0]?.url || null);
    const [text, setText] = useState(post?.post_text || '');
    const [showFullText, setShowFullText] = useState(false);
    const [errors, setErrors] = useState([]);
    
    
    const resetPostData = () => {
        setPictures([...post?.images]);
        setText(post?.post_text);
        setShowImage(pictures[0]?.url);
    }
    
    const validatePostEdit = () => {
        const newErrors = {};

        if (!text || (text.length < 10 || text.length > 1000)) newErrors.text = 'Text (10-1000) characters';
    
        return newErrors;
    }
    
    useEffect(() => {
        if (isSubmitted) setErrors(validatePostEdit());
    }, [isSubmitted, text]);
    
    useEffect(() => {
        if (!user?.active && isUpdating) setIsUpdating(false);
    }, [user?.active, isUpdating]);
    
    useEffect(() => {
        if (post) resetPostData();
    }, [sessionSingleUser]);
    
    
    if (!user || !post) return null;
    
    
    const handleSubmitEdit = async () => {
        const newErrors = validatePostEdit();
        setIsSubmitted(true);
        if (Object.values(newErrors).length > 0) return setErrors(newErrors);
        
        const images = [];
        pictures.forEach(img => {
            if (img.url !== '' && img.url !== default_picture) images.push(img);
        });
        
        const postData = {
            postText: text,
            images
        }
        
        const data = await dispatch(updatePost(post.id, sessionUser.id, postData));
        if (data.errors) {
            return setErrors(data.errors);
        }
        
        return setIsUpdating(false);
    }
    
    
    
    const handleEditButtonPressed = () => {
        if (sessionUser?.id === 1) return alert('Demo user cannot edit posts.');
        
        if (!isUpdating) {
            resetPostData();
            return setIsUpdating(true);
        }
        else return handleSubmitEdit();
    }
    
    
    const handleSlideImagePressed = (img, i) => {
        if (!isUpdating) return setShowImage(img.url);
        pictures[i].url = '';
        return setPictures([...pictures]);
    }
    
    const updateImageFile = (e, i) => {
        const file = e.target.files[0];
        handleImageUpload(file, i);
    }
    
    const handleImageUpload = async (file, i) => {
        const formData = new FormData();
        formData.append("image", file);
    
        const url = await handleFetch(formData);
        if (!url) return setErrors(['Failed to get image url']);
        
        pictures[i].url = url;
        
        if (i === 0) setShowImage(url);
        return setPictures([...pictures]);
    };
    
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
    
    const hasPostImages = (pictures[0]?.url && pictures[0]?.url !== default_picture) ||
                          (pictures[1]?.url && pictures[1]?.url !== default_picture) ||
                          (pictures[2]?.url && pictures[2]?.url !== default_picture) ||
                          (pictures[3]?.url && pictures[3]?.url !== default_picture) ||
                            (pictures[4]?.url && pictures[4]?.url !== default_picture);
    
    
    return (
        <div className="profile-post-div-container">
            
            <div className="post-title-bar-div" data-theme={sessionTheme}>
                {(user?.id === sessionUser?.id) && 
                    <button className='post-ellipsis-button'
                        title={!isUpdating ? 'Edit Post' : 'Submit Edit'}
                        onClick={(e) => handleEditButtonPressed(e)}
                    >{!isUpdating ? <i className="fas fa-ellipsis-h"/> : <i className="fa fa-paper-plane post-paper-plane"/>}
                    </button>
                }
            </div>
            
            
            
            <div className="post-images-container">
                {(showImage && (showImage.url !== default_picture || isUpdating)) &&
                    <img className='post-image-preview'
                        src={showImage}
                        alt='Post Preview'
                    />
                }
                
                {(hasPostImages || isUpdating) && 
                <div className='post-image-slide-bar'>
                        {pictures?.map((img, i) => { return (img?.url && (!isUpdating && img.url !== default_picture)) ?
                                <img key={i} className='post-slide-image'
                                    src={img.url}
                                    alt='Slide Bar'
                                    onClick={() => handleSlideImagePressed(img, i)}
                                />
                            : (img?.url && isUpdating) ?
                                <img key={i} className='post-slide-image'
                                    src={img.url}
                                    alt='Slide Bar'
                                    onClick={() => handleSlideImagePressed(img, i)}
                                />
                            : (isUpdating && !img.url) &&
                                <input key={i}
                                    className="update-post-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => updateImageFile(e, i)}
                                />
                        })}
                </div>
                }
            </div>




            <div className="profile-post-text-container">
                {errors?.text && <p className='post-text-error-p'>{errors.text}</p>}
                {(!isUpdating) ?
                    (!showFullText && post?.post_text?.length > 220) ?
                        <p className='text-secondary profile-post-text-area'>{post?.post_text.slice(0, 220)}
                            <button className='feed-post-text-seemore text-secondary'
                                onClick={() => setShowFullText(true)}
                            >...see more</button>
                        </p>
                    : (post?.post_text?.length <= 220) ?
                        <p className='text-secondary profile-post-text-area'>{post?.post_text.slice(0, 220)}</p>
                    : (showFullText) &&
                    <p className='text-secondary profile-post-text-area'>{post?.post_text}
                        <button className='feed-post-text-seeless text-secondary'
                            onClick={() => setShowFullText(false)}
                        >show less</button>
                    </p>
                : (isUpdating) &&
                    <textarea className='post-text-edit-input'
                        placeholder="What would you like to say?"
                        maxLength={1000}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                }
            </div>
            
            {(user?.id === sessionUser?.id) &&
                <div className='post-edit-buttons-div'>
                    <OpenModalButton 
                        className='post-delete-button'
                        buttonText={<i title="Delete Post" className="fa fa-trash"/>}
                        modalComponent={<DeletePostModal user={sessionUser} post={post}/>}
                    />
                </div>
            }
            
        </div>
    );
};

export default Post;
