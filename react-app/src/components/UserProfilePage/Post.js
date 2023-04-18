import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updatePost } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import './Post.css';
import DeletePostModal from "./DeletePostModal";


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionTheme = useSelector(state => state.session.theme);
    
    const default_picture = 'https://assets.website-files.com/61e2d9500e1bc451a3ea1aa3/629a49e7ab53625cb2c4e791_Brand-pattern.jpg';
    const postImages = [...post?.images];
    postImages[0] = postImages[0] ? {...postImages[0]} : {id: null, url: default_picture};
    postImages[1] = postImages[1] ? {...postImages[1]} : {id: null, url: default_picture};
    postImages[2] = postImages[2] ? {...postImages[2]} : {id: null, url: default_picture};
    postImages[3] = postImages[3] ? {...postImages[3]} : {id: null, url: default_picture};
    postImages[4] = postImages[4] ? {...postImages[4]} : {id: null, url: default_picture};
    
    
    const [pictures, setPictures] = useState(postImages);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showImage, setShowImage] = useState(post?.images?.[0]?.url || null);
    const [title, setTitle] = useState(post?.post_title || '');
    const [text, setText] = useState(post?.post_text || '');
    const [errors, setErrors] = useState([]);
    
    
    const resetPostData = () => {
        setPictures(postImages);
        setTitle(post?.post_title);
        setText(post?.post_text);
    }
    
    const validatePostEdit = () => {
        const newErrors = {};
        
        if (title && (title.length < 4 || title.length > 40)) newErrors.title = 'Title (4-40) characters';
        if (!text || (text.length < 10 || text.length > 250)) newErrors.text = 'Text (10-250) characters';
    
        return newErrors;
    }
    
    useEffect(() => {
        if (isSubmitted) setErrors(validatePostEdit());
    }, [isSubmitted, text, title])
    
    useEffect(() => {
        if (!user?.active && isUpdating) setIsUpdating(false);
    }, [user?.active, isUpdating])
    
    
    
    if (!user || !post) return null;
    
    
    
    const handleSubmitEdit = async () => {
        const newErrors = validatePostEdit();
        setIsSubmitted(true);
        if (Object.values(newErrors).length > 0) return setErrors(newErrors);
        
        const images = [];
        pictures.forEach(img => {
            if (img.url !== '' && img.url !== default_picture) images.push(img);
        });
        
        if (!images.length > 0 && title === post.post_title && text === post.post_text) {
            resetPostData();   
            return setIsUpdating(false);
        }
        
        const postData = {
            postTitle: title,
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

    
    const showPostTitle = () => {
        return (
            <div className="post-title-bar-div" data-theme={sessionTheme}>
                {!isUpdating ? <h4 className='text-primary'>{post?.post_title}</h4>
                :
                    <input className='post-title-edit-input'
                        placeholder="Title"
                        maxLength={40}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                }
                
                {(user?.id === sessionUser?.id) && 
                    <button className='post-ellipsis-button'
                        title='Edit Post'
                        onClick={(e) => handleEditButtonPressed(e)}
                    >{!isUpdating ? <i className="fas fa-ellipsis-h"/> : <i className="fa fa-paper-plane post-paper-plane"/>}
                    </button>
                }
            </div>
        );
    };
    
    
    
    const hasPostImages = (pictures[0].url && pictures[0].url !== default_picture) ||
                          (pictures[1].url && pictures[1].url !== default_picture) ||
                          (pictures[2].url && pictures[2].url !== default_picture) ||
                          (pictures[3].url && pictures[3].url !== default_picture) ||
                            (pictures[4].url && pictures[4].url !== default_picture);
    
    const showPostImages = () => {
        
        if (!showImage && isUpdating) setShowImage(pictures[0].url);
        if ((showImage === '' || showImage === default_picture) && !isUpdating) setShowImage(null);
        
        return (
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
        );
    };
    
    
    const showPostText = () => {
        return (
            <div className="profile-post-text-container">
                {errors?.text && <p className='post-text-error-p'>{errors.text}</p>}
                {!isUpdating ? <p className='text-secondary'>{post?.post_text}</p>
                :
                    <textarea className='post-text-edit-input'
                        placeholder="What would you like to say?"
                        maxLength={250}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                }
            </div>
        );
    };
    
    
    return (
        <div className="profile-post-div-container">
            
            
            {errors?.title && <p className='post-title-error-p'>{errors.title}</p>}
            {showPostTitle()}
            
            {showPostImages()}

            {showPostText()}
            
            {(user?.id === sessionUser?.id) &&
                <div className='post-edit-buttons-div'>
                    <OpenModalButton 
                        title="Delete Post"
                        className='post-delete-button'
                        buttonText={<i className="fa fa-trash"/>}
                        modalComponent={<DeletePostModal user={sessionUser} post={post}/>}
                    />
                </div>
            }
            
        </div>
    );
};

export default Post;
