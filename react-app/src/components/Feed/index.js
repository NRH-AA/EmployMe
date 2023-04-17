import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { setWindowPath, getPostsThunk, appendPostsThunk, getNewsThunk, changeTheme, changeThemeThunk, resetState } from "../../store/session";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const sessionUser = useSelector(state => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    const sessionNews = useSelector(state => state.session.news);
    const sessionTheme = useSelector(state => state.session.theme);
    const [theme, setTheme] = useState(sessionUser?.theme);
    const posts = useSelector(state => state.session.posts);
    const [previewImages, setPreviewImages] = useState({});
    
    const [offset, setOffset] = useState(0);
    const [newsOffset, setNewsOffset] = useState(0);
    const [newsLimit, setNewsLimit] = useState([]);
    
    
    
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
    
    const userSkillArray = sessionUser?.skills?.split(';') || [];
    
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
            <p className="text-primary feed-news-text">- {news.author}</p>
            <p className='text-secondary feed-news-title'>{news.title.slice(0, 80)} ...</p>
        </>)
    }
    
    // Posts Preview Image
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
        <div id="feed-container" data-theme={theme}>
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data" data-theme={theme}>
                    <img
                        title="Go to your profile"
                        src={sessionUser?.profile_picture} 
                        alt={sessionUser?.first_name}
                        onClick={(e) => history.push(`/profile/${sessionUser?.id}`)}
                    />
                    
                    <p className='text-primary'>{sessionUser?.first_name + ' ' + sessionUser?.last_name}</p>
                    
                    <div id="feed-user-profile-skills-div">
                        {userSkillArray && userSkillArray.map((skill, i) =>
                            <p key={i} className="text-secondary feed-skill-p">{skill}</p>
                        )}
                    </div>
                    
                    <div id='feed-user-connections-div'>
                        <h4 className='text-primary'>Connections</h4>
                    </div>
                    
                </div>
                
                <div id="feed-posts-container">
                    {posts?.length && posts?.map((post, i) => 
                    <div key={i} className="feed-post-container text-primary" data-theme={theme}>
                        <div className="feed-post-top-div">
                            <img
                                title={`Check out ${post.user.first_name}'s profile`}
                                src={post.user.profile_picture} 
                                alt={post.user.first_name}
                                onClick={(e) => history.push(`/profile/${post.user.id}`)}
                            />
                            <div className="feed-post-top-right-div">
                                <p className='feed-post-top-right-p text-primary'><b>{post.user.first_name + ' ' + post.user.last_name}</b></p>
                                <p className='feed-post-top-right-p text-secondary'>{post.user.occupation}</p>
                            </div>
                        </div>
                        
                        <div className="feed-post-text-div" data-theme={theme}>
                            <h4 className='text-primary'>{post.post_title}</h4>
                            
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
                                    {post.images.map((image, j) => 
                                        <img key={j} className='feed-post-sidebar-image'
                                            title="Click to set as preview image" 
                                            src={image.url}
                                            alt={`Post Side ${i}`}
                                            onClick={() => setPreviewImage(post.id, j)}
                                        />
                                    )}
                                </div>
                            }
                            </div>
                            
                            <p className='text-secondary'>{post.post_text}</p>
                        </div>
                    
                    </div>)}
                    
                    <button className='button-main' data-theme={theme}
                        onClick={(e) => {setOffset(offset + 6); dispatch(appendPostsThunk(offset))}}
                    >See more</button>
                </div>
                
                <div id="feed-news-container" data-theme={theme}>
                    <div id="feed-news-div">
                        <h3 style={{marginLeft: "10px", fontSize: "16px"}} className='text-primary'>EmployMe News</h3>
                        {newsLimit?.map((news, i) => 
                            <div key={i}>
                                {showNewsAuthor(news)}
                            </div>
                        )}
                        
                        
                        {/* {newsObj?.author && 
                        <div className='news-article-div'>
                            
                            <h4 className='text-primary'>{newsObj.description.split('.')[0]}</h4>
                        </div>}  */}
                    </div>
                    
                    {(!newsLimit?.length) ?
                        <p>
                            News cannot be populated on production servers. 
                            This is a limit from the API.
                        </p>
                    :
                        <button id="feed-news-button" className='button-main' data-theme={theme}
                            type='button'
                            title='See More News'
                            onClick={() => {setNewsOffset(newsOffset + 10); updateNews()}}
                        >More News</button>
                    }
                    
                </div>
            
            </div>
            
            
            <div id="feed-footer-div" data-theme={theme}>
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
