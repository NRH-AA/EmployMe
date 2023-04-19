import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";



const UserPostComponent = ({post}) => {
    const history = useHistory();
    
    const sessionUser = useSelector(state => state.session.user);
    const posts = useSelector(state => state.session.posts);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const [previewImages, setPreviewImages] = useState({});
    const [showMore, setShowMore] = useState(false);
    
    useEffect(() => {
        if (posts?.length > 0) {
            const previewImagesArray = {};
            for (const post of posts) {
                previewImagesArray[post.id] = post?.images?.[0]?.url;
            }
            setPreviewImages(previewImagesArray);
        }
    }, [posts]);
    
    
    useEffect(() => {
        if (theme && (theme !== sessionUser?.theme)) setTheme(sessionUser.theme);
    }, [sessionUser, theme])
    
    
    const setPreviewImage = (postId, imageIndex) => {
        const newPreviews = {...previewImages};
        let url = '';
        for (const post of posts) {
            if (post.id === postId) url = post.images[imageIndex].url;
        }
        
        if (!url) return;
        
        newPreviews[postId] = url;
        setPreviewImages(newPreviews);
    }
    
    return (
        <div className="feed-post-container text-primary" data-theme={theme}>
        <div className="feed-post-top-div">
            <img
                title={`Check out ${post.user.first_name}'s profile`}
                src={post.user.profile_picture} 
                alt={post.user.first_name}
                onClick={() => history.push(`/profile/${post.user.id}`)}
            />
            <div className="feed-post-top-right-div">
                <p className='feed-post-top-right-p text-primary'><b>{post.user.first_name + ' ' + post.user.last_name}</b></p>
                <p className='feed-post-top-right-p text-secondary'>{post.user.occupation}</p>
            </div>
        </div>
        
        <div className="feed-post-text-div">
            {!showMore ? <p className='text-secondary'>{post.post_text.slice(0, 220)}
                {post?.post_text?.length > 220 && 
                    <button className='feed-post-text-seemore text-secondary'
                        onClick={() => setShowMore(!showMore)}
                    >...see more</button>
                }
            </p>
            :
                <p className='text-secondary'>{post.post_text}
                    <button className='feed-post-text-seeless text-secondary'
                        onClick={() => setShowMore(!showMore)}
                    >show less</button>
                </p>
            }

            
            <div className='feed-post-image-container'>
            {previewImages[post.id] && 
                <NavLink to={{pathname: previewImages[post.id]}} 
                    className='feed-post-image-preview-navlink'
                    target='_blank'>
                    <img className='feed-post-image-preview'
                        title="Click to see full size"
                        src={previewImages[post.id]}
                        alt="Post Preview"
                    />
                </NavLink>
            }
            
            {post.images && 
                <div className='feed-post-image-sidebar'>
                    {post.images.map((image, i) => 
                        <img key={i} className='feed-post-sidebar-image'
                            title="Click to set as preview image" 
                            src={image.url}
                            alt={`Post Side`}
                            onClick={() => setPreviewImage(post.id, i)}
                        />
                    )}
                </div>
            }
            </div>
            
        </div>
    </div>
    )
    
}

export default UserPostComponent;
