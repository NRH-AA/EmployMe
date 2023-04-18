import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { setWindowPath, getPostsThunk, appendPostsThunk, getNewsThunk, changeTheme, changeThemeThunk, resetState } from "../../store/session";
import UserProfileComponant from "./UserProfileComponant";
import UserPostComponant from "./UserPostComponant";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    
    const sessionUser = useSelector(state => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    const sessionNews = useSelector(state => state.session.news);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const posts = useSelector(state => state.session.posts);
    
    const [offset, setOffset] = useState(0);
    const [newsOffset, setNewsOffset] = useState(0);
    const [newsLimit, setNewsLimit] = useState([]);
    
    
    useEffect(() => {
        if (sessionUser) {
            dispatch(changeTheme(theme));
            dispatch(getPostsThunk());
            if (!sessionNews) dispatch(getNewsThunk());
        } else {
            dispatch(resetState);
        }
    }, [dispatch, theme, sessionUser, sessionNews]);
    
    
    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) {
            dispatch(setWindowPath(window.location.pathname));
        };
    }, [dispatch, sessionPath]);
    
    
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
    
    // News
    if (sessionNews && !newsLimit.length) {
        const newNews = sessionNews.slice(0, 10);
        setNewsLimit(newNews);
    }
    
    const updateNews = () => {
        if (sessionNews?.length) {
            const newNews = sessionNews.slice(newsOffset, newsOffset + 10);
            setNewsLimit(newNews);
        }
    }
    
    const showNewsAuthor = (news) => {
        if (!news.author) return null;
        let splitAuthor = news.author.split('(')[1];
        if (splitAuthor) {
            news.author = splitAuthor.split(')')[0];
        } 
        
        return (<>
            <p className="text-primary feed-news-text">- {news.author.toUpperCase()}</p>
            <p className='text-secondary feed-news-title'>{news.title.slice(0, 80)} ...</p>
        </>)
    }
    
    const showNewsArea = () => {
        return <div id="feed-news-div">
        <h3 style={{marginLeft: "10px", fontSize: "16px"}} className='text-primary'>EmployMe News</h3>
        {newsLimit?.map((news, i) => 
            <div key={i}>
                {showNewsAuthor(news)}
            </div>
        )}
    </div>
    }
    
    
    return (
        <div id="feed-container" data-theme={theme}>
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data">
                    <UserProfileComponant />
                </div>
                
                <div id="feed-posts-container">
                    {posts?.length && posts?.map((post, i) => 
                        <UserPostComponant post={post} key={i} />
                    )}
                    
                    <button className='button-main'
                        onClick={(e) => {setOffset(offset + 6); dispatch(appendPostsThunk(offset))}}
                    >See more</button>
                </div>
                
                <div id="feed-news-container">
                    {showNewsArea()}
                    
                    {(!newsLimit?.length) ?
                        <p>
                            News cannot be populated on production servers. 
                            This is a limit from the API.
                        </p>
                    :
                        <button id="feed-news-button" className='button-main'
                            type='button'
                            title='See More News'
                            onClick={() => {setNewsOffset(newsOffset + 10); updateNews()}}
                        >More News</button>
                    }
                    
                </div>
            
            </div>
            
            
            <div id="feed-footer-div">
                <NavLink className="footer-p"
                    to='/about'
                ><i className="fa fa-info-circle"></i></NavLink>
                    
                <NavLink className="footer-p"
                    to={{pathname: "https://github.com/NRH-AA"}}
                    target="_blank"
                ><i className="fa-brands fa-github"></i></NavLink>
                    
                <NavLink className="footer-p"
                    to={{pathname: "https://www.linkedin.com/in/nathan-heinz-5b3718231/"}}
                    target="_blank"
                ><i className="fa-brands fa-linkedin"></i></NavLink>
                
                <button className='button-main'
                    onClick={() => switchTheme()}
                >Change Theme</button>
            </div>
        </div>
    );
};

export default Feed;
