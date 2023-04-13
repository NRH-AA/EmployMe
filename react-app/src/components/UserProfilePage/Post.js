import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { updateImages, updatePost } from "../../store/session";
import { deletePost } from "../../store/session";
import './Post.css';


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editButtonPressed, setEditButtonPressed] = useState(false);
    const [pictures, setPictures] = useState(post.images || []);
    const [title, setTitle] = useState(post.post_title || '');
    const [text, setText] = useState(post.post_text || '');
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        if (!user?.active && isUpdating) setIsUpdating(false);
    }, [user?.active, isUpdating])
    
    if (!user) return null;
    
    return (
        <div className="profile-post-div-container">
            
            
            <div className="post-title-bar-div">
                <h4>{post?.post_title}</h4>
                
                {(user?.id === sessionUser?.id) && <button className='post-ellipsis-button'
                    
                ><i class="fas fa-ellipsis-h"/></button>}
            </div>

            
            
            <div className="profile-post-text-container">
                <p>{post?.post_text}</p>
            </div>
            
        </div>
    );
};

export default Post;
