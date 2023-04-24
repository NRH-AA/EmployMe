import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { updateFeedPostThunk } from "../../store/session";
import "./Posts.css";

const UserPostComponent = ({post}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    
    const sessionUser = useSelector(state => state.session.user);
    const posts = useSelector(state => state.session.posts);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const [previewImages, setPreviewImages] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [creatingComment, setCreatingComment] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [commentsLimit, setCommentsLimit] = useState(1);
    const [textAreaHeight, setTextAreaHeight] = useState(25);
    
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
    
    const handlePostLike = async () => {
        const res = await fetch(`/api/posts/${post.id}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: sessionUser.id
            })
        });
        
        if (res.ok) {
            dispatch(updateFeedPostThunk(post.id));
        };
    };
    
    const handlePostComment = async () => {
        if (comment.length === 0) return;
        
        const res = await fetch(`/api/posts/${post.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: sessionUser.id,
                comment: comment
            })
        })
        
        if (res.ok) {
            dispatch(updateFeedPostThunk(post.id));
        };
        
        setCreatingComment(false);
        setComment('');
    }
    
    const handleCommentTextArea = (e) => {
        setComment(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight + 5}px`;
    }
    
    const handleBlur = (e) => {
        e.target.style.height = 'auto';
    }
    
    const postDateSplit = post.createdAt.split(' ');
    const createdAtString = `${postDateSplit[2]}  ${postDateSplit[1]}  ${postDateSplit[3]}`;
    
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
                <div className='feed-post-top-right-inner-div'>
                    <p className='feed-post-top-right-p text-primary'><b>{post.user.first_name + ' ' + post.user.last_name}</b></p>
                    <p className='text-secondary feed-post-date-p'>{createdAtString}</p>
                </div>
                <p className='feed-post-top-right-p text-secondary'>{post.user.occupation}</p>
            </div>
        </div>
        
        <div className="feed-post-text-div">
            {(post?.post_text?.length > 220 && !showMore) ? 
            <>
                <div className='feed-post-text-area'>
                    <p className='text-secondary'>{post.post_text.slice(0, 220)}
                        <button className='feed-post-text-seemore text-secondary'
                            onClick={() => setShowMore(true)}
                        >...see more</button>
                    </p>
                </div>
            </> : (showMore && post?.post_text?.length > 220) ?
            <>
                <div className='feed-post-text-area'>
                    <p className='text-secondary'>{post.post_text}</p>
                    <button className='feed-post-text-seeless text-secondary'
                        onClick={() => setShowMore(false)}
                    >show less</button>
                </div>
            </> : (post?.post_text?.length <= 220 && !showMore) &&
            <>
                <div className='feed-post-text-area'>
                    <p className='text-secondary'>{post.post_text}</p>
                </div>
            </>
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
            
            <div className='feed-post-stat-div'>
                {(post.user_likes?.length > 0) && 
                    <p className='feed-post-likes-p'><img className='feed-post-likes-image'
                        src='https://static.licdn.com/sc/h/emei2gdl9ikg7penkh9ij9llx'
                        alt='Post Likes'
                    />{post.user_likes?.length}</p>
                }
                
                {(post.comments?.length > 0) && 
                    <p className='text-secondary feed-post-stats-p'
                        onClick={() => {setCommentsLimit(1); setShowComments(!showComments)}}
                    >
                    {(post.comments.length === 1) ? `${post.comments.length} comment` : `${post.comments.length} comments`}
                    </p>
                }
            </div>
            
            <div className='feed-post-like-comment-div'>
                <button className='like-comment-button text-secondary'
                    onClick={() => handlePostLike()}
                ><i className="fa fa-thumbs-up"/> Like</button>
                
                <button className='like-comment-button text-secondary'
                    onClick={() => setCreatingComment(!creatingComment)}
                ><i className="fas fa-comments"/> Comment</button>
            </div>
            
            {(post?.comments?.length === 0 && post?.user_likes?.length === 0) && 
                <p className='text-secondary'>
                    <i className="fa-regular fa-bell comment-bell"/> Be the first to react
                </p>
            }
            
            {creatingComment && 
                <div className='feed-post-create-comment-div'>
                    <img className='feed-post-create-comment-img'
                        src={sessionUser?.profile_picture}
                        alt={sessionUser?.first_name}
                    />
                    
                    
                        <textarea className='feed-post-create-comment-input'
                            value={comment}
                            maxLength={250}
                            onBlur={handleBlur}
                            onChange={handleCommentTextArea}
                            autoFocus
                        />
                </div>
            }
            
            {(creatingComment && comment.length > 0) &&
                <button className='button-main feed-post-submit-comment-button'
                    onClick={() => handlePostComment()}
                >Post</button>
            }
            
            {((creatingComment || showComments) && post.comments?.length > 0) && 
                <div className='feed-post-comments-container'>
                    {post.comments.map((el, i) => {
                        if (i < commentsLimit) {
                            return <div key={i} className='feed-post-comment-div'>
                                <img className='feed-post-comment-image'
                                    src={el.user.profile_picture}
                                    alt={el.user.first_name}
                                    onClick={() => history.push(`/profile/${el.user.id}`)}
                                />
                                <div className='feed-post-comment-text-div'>
                                    <p className='text-primary feed-post-comment-user-name'
                                        onClick={() => history.push(`/profile/${el.user.id}`)}
                                    >{el.user.first_name} {el.user.last_name}</p>
                                        
                                    {el.user.bio && <p className='text-secondary'>{el.user?.bio?.split(0, 40)} {el.user.bio?.length > 40 && '...'}</p>}
                                    <p className='text-primary feed-post-comment-p'>{el.text}</p>
                                </div>
                            </div>
                        } else return '';
                    })}
                        
                    {(post.comments?.length > commentsLimit) && 
                        <button className='button-main feed-post-load-comments-button'
                            onClick={() => setCommentsLimit(commentsLimit * 2)}
                        >Load More</button>
                    }
                </div>
            }
            
        </div>
    </div>
    )
    
}

export default UserPostComponent;
