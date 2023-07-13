import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import { changeTheme, changeThemeThunk, 
    resetState, removeSingleUserAction} from "../../store/session";

import {getPostsThunk, appendPostsThunk} from '../../store/posts';

import UserProfileComponent from "./UserProfileComponent";
import UserPostComponent from "./UserPostComponent";
import NewsComponent from "./NewsComponent";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    
    const sessionUser = useSelector(state => state.session.user);
    const sessionSingleUser = useSelector(state => state.session.singleUser);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const posts = useSelector(state => state.posts.posts);
    
    const [offset, setOffset] = useState(0);
    const [postText, setPostText] = useState('');
    
    useEffect(() => {
        if (sessionUser) {
            dispatch(changeTheme(theme));
            dispatch(getPostsThunk());
        } else {
            dispatch(resetState);
        }
    }, [dispatch, theme, sessionUser]);
    
    useEffect(() => {
        if (theme !== sessionUser?.theme) setTheme(sessionUser?.theme);
    }, [sessionUser, theme])
    
    useEffect(() => {
        if (sessionSingleUser) dispatch(removeSingleUserAction());
    }, [sessionSingleUser, dispatch])
    
    
    const handleScroll = () => {
        const scollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        if (Math.ceil(scrolled) >= Math.ceil(scollable)) {
            const newOffset = offset + 6;
            dispatch(appendPostsThunk(newOffset));
            setOffset(newOffset);
        };
    };
    
    
    useBottomScrollListener(handleScroll);
    
    
    const switchTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'blue'
        : theme === 'blue' ? 'purple' : 'light';
        dispatch(changeThemeThunk(sessionUser.id, newTheme));
		setTheme(newTheme);
	}
    
    
    if (!sessionUser) return null;
    
    const handleCommentTextArea = (e) => {
        setPostText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight + 5}px`;
    }
    
    const handleBlur = (e) => {
        e.target.style.height = 'auto';
    }
    
    return (
        <div id="feed-container" data-theme={theme}>
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data">
                    <UserProfileComponent />
                </div>
                
                <div id="feed-posts-container">
                    <div id='feed-create-post-container'>
                        <div id='feed-cp-img-text'>
                            <img id='feed-cp-user-profile-picture'
                                title="Go to your profile"
                                src={sessionUser?.profile_picture}
                                alt={sessionUser?.first_name}
                            />
                            
                            <textarea id='feed-cp-textarea' className='feed-post-create-comment-input'
                                placeholder="Start a post"
                                value={postText}
                                maxLength={250}
                                onBlur={handleBlur}
                                onChange={handleCommentTextArea}
                                autoFocus
                            />
                        </div>
                        
                        <div id='feed-cp-buttons-container'>
                            <button className='feed-cp-button'
                                disabled={true}
                            ><i className="fa-solid fa-image feed-cp-icon-image"/> Photo</button>
                            
                            <button className='feed-cp-button'
                                disabled={true}
                            ><i className="fa-brands fa-youtube feed-cp-icon-video"/> Video</button>
                            
                            <button className='feed-cp-button'
                                disabled={true}
                            ><i className="fa-solid fa-calendar feed-cp-icon-event"/> Event</button>
                            
                            <button className='feed-cp-button'
                                disabled={true}
                            ><i class="fa-solid fa-newspaper feed-cp-icon-article"/> Write article</button>
                        </div>
                    </div>
                    
                    
                    {posts?.length && posts?.map((post, i) => 
                        <UserPostComponent post={post} key={i} />
                    )}
                    
                    {posts?.length && <button className='button-main'
                        onClick={() => {setOffset(offset + 6); dispatch(appendPostsThunk(offset))}}
                    >See more</button>}
                </div>
                
                <NewsComponent />
            
            </div>
            
            
            <div id="feed-footer-div">
                <NavLink className="footer-p"
                    title='About EmployMe'
                    to='/about'
                ><i className="fa fa-info-circle"></i></NavLink>
                    
                <NavLink className="footer-p"
                    title='GitHub'
                    to={{pathname: "https://github.com/NRH-AA"}}
                    target="_blank"
                ><i className="fa-brands fa-github"></i></NavLink>
                    
                <NavLink className="footer-p"
                    title='LinkedIn'
                    to={{pathname: "https://www.linkedin.com/in/nathan-heinz-5b3718231/"}}
                    target="_blank"
                ><i className="fa-brands fa-linkedin"></i></NavLink>
                
                <button className='theme-change-button'
                    title='Change Theme'
                    onClick={() => switchTheme()}
                ><i className="fa fa-tachometer"/></button>
            </div>
        </div>
    );
};

export default Feed;
