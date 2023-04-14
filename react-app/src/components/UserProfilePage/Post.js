import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updatePost } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import './Post.css';
import DeletePostModal from "./DeletePostModal";


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pictures, setPictures] = useState(post.images || []);
    const [title, setTitle] = useState(post.post_title || '');
    const [text, setText] = useState(post.post_text || '');
    const [errors, setErrors] = useState([]);
    
    const validatePostEdit = () => {
        const newErrors = {};
        
        if (title && (title.length < 4 || title.length > 40)) newErrors.title = 'Title (4-40) characters';
        if (!text || (text.length < 10 || text.length > 250)) newErrors.text = 'Text (10-250) characters';
    
        return newErrors;
    }
    
    useEffect(() => {
        if (isSubmitted) setErrors(validatePostEdit());
    }, [text, title])
    
    useEffect(() => {
        if (!user?.active && isUpdating) setIsUpdating(false);
    }, [user?.active, isUpdating])
    
    if (!user) return null;
    
    const handleSubmitEdit = async () => {
        const newErrors = validatePostEdit();
        setIsSubmitted(true);
        if (Object.values(newErrors).length > 0) return setErrors(newErrors);
        
        if (title === post.post_title && text === post.post_text) return setIsUpdating(false);
        
        const postData = {
            postTitle: title,
            postText: text
        }
        
        const data = await dispatch(updatePost(post.id, sessionUser.id, postData));
        if (data.errors) {
            return setErrors(data.errors);
        }
        
        setIsUpdating(false);
    }
    
    const handleEditButtonPressed = () => {
        if (!isUpdating) return setIsUpdating(true);
        else return handleSubmitEdit();
    }
    
    return (
        <div className="profile-post-div-container">
            
            
            {errors?.title && <p className='post-title-error-p'>{errors.title}</p>}
            <div className="post-title-bar-div">
                {!isUpdating ? <h4>{post?.post_title}</h4>
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
                        onClick={handleEditButtonPressed}
                    >{!isUpdating ? <i class="fas fa-ellipsis-h"/> : <i className="fa fa-paper-plane post-paper-plane"/>}
                    </button>
                }
            </div>

            
            <div className="profile-post-text-container">
                {errors?.text && <p className='post-text-error-p'>{errors.text}</p>}
                {!isUpdating ? <p>{post?.post_text}</p>
                :
                    <textarea className='post-text-edit-input'
                        placeholder="What would you like to say?"
                        maxLength={250}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                }
            </div>
            
            <div className='post-edit-buttons-div'>
                <OpenModalButton 
                    className='post-delete-button'
                    buttonText={<i className="fa fa-trash"/>}
                    modalComponent={<DeletePostModal user={sessionUser} post={post}/>}
                />
            </div>
            
        </div>
    );
};

export default Post;
