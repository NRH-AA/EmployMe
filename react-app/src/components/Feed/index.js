import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import { getPostsThunk, appendPostsThunk, 
        changeTheme, changeThemeThunk, resetState, 
        removeSingleUserAction
} from "../../store/session";

import UserProfileComponent from "./UserProfileComponent";
import UserPostComponent from "./UserPostComponent";
import NewsComponent from "./NewsComponent";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    
    const sessionUser = useSelector(state => state.session.user);
    const sessionSingleUser = useSelector(state => state.session.singleUser);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const posts = useSelector(state => state.session.posts);
    
    const [offset, setOffset] = useState(0);
    
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
    }, [sessionSingleUser])
    
    
    const handleScroll = () => {
        const scollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        if (Math.ceil(scrolled) === Math.ceil(scollable)) {
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
    
    
    return (
        <div id="feed-container" data-theme={theme}>
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data">
                    <UserProfileComponent />
                </div>
                
                <div id="feed-posts-container">
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
