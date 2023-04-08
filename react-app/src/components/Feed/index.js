import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import OpenModalButton from "../OpenModalButton";
import { setWindowPath, getPostsThunk, appendPostsThunk, getNewsThunk } from "../../store/session";
import InfoModal from "./InfoModal";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    const sessionNews = useSelector(state => state.session.news);
    const posts = useSelector(state => state.session.posts)
    const [offset, setOffset] = useState(0);
    const [newsObj, setNewsObj] = useState({});

    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath]);
    
    useEffect(() => {
        if (!posts?.length) dispatch(getPostsThunk());
    }, [dispatch, posts]);
    
    useEffect(() => {
        if (!sessionNews) dispatch(getNewsThunk());
    }, [dispatch, sessionNews])
    
    
    const handleScroll = () => {
        const scollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        if (Math.ceil(scrolled) === Math.ceil(scollable)) {
            const newOffset = offset + 6;
            dispatch(appendPostsThunk(newOffset))
            setOffset(newOffset);
        };
    };
    
    useBottomScrollListener(handleScroll);
    
    if (!sessionUser) return null;
    const userSkillArray = sessionUser.skills.split(';');
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    if (sessionNews && !newsObj?.author) {
        setNewsObj(sessionNews[0]);
    }
    
    const updateNews = () => {
        if (sessionNews?.length) {
            setNewsObj(sessionNews[getRandomInt(sessionNews.length - 1)]);
        }
    }
    
    
    return (
        <div id="feed-container">
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data">
                    <img src={sessionUser?.profile_picture} alt={sessionUser?.first_name}/>
                    
                    <button id="feed-user-profile-button" type="button"
                        title="Profile"
                        onClick={() => history.push(`/profile/${sessionUser?.id}`)}
                    ><i className="fa-solid fa-ellipsis-vertical"></i></button>
                    
                    <p>{sessionUser?.first_name + ' ' + sessionUser?.last_name}</p>
                    <p>{sessionUser?.occupation}</p>
                    
                    <div id="feed-user-profile-skills-div">
                        {userSkillArray.map((skill, i) =>
                            <p key={i}>{skill + ' |'}</p>
                        )}
                    </div>
                    
                </div>
                
                <div id="feed-posts-container">
                    {posts?.length && posts?.map((post, i) => <div key={i} className="feed-post-container">
                        <div className="feed-post-top-div"> 
                            <img src={post.user.profile_picture} alt={post.user.first_name}/>
                            <div className="feed-post-top-right-div">
                                <p><b>{post.user.first_name + ' ' + post.user.last_name}</b></p>
                                <p>{post.user.occupation}</p>
                            </div>
                        </div>
                        
                        <div className="feed-post-text-div">
                            <h4><b>{post.post_title}</b></h4>
                            <p>{post.post_text}</p>
                        </div>
                    
                    </div>)}
                    
                    <button
                        onClick={() => {setOffset(offset + 6); dispatch(appendPostsThunk(offset))}}
                    >See more</button>
                </div>
                
                <div id="feed-news-container">
                    <div id="feed-news-div">
                        {newsObj?.author && <div className='news-article-div'>
                            <div id='news-article-top-div'>
                                <h3>{newsObj.author}</h3>
                                <img src={newsObj.urlToImage} alt='Artiacle'/>
                            </div>
                            
                            <h4>{newsObj.description.split('.')[0]}</h4>
                            <p>{newsObj.content.split('[')[0]}</p>
                        </div>} 
                    </div>
                    
                    {(!newsObj || !newsObj.author) ?
                        <p>
                            News cannot be populated on production servers. 
                            This is a limit from the API.
                        </p>
                    :
                        <button id="feed-news-button" type='button'
                            title='See More News'
                            onClick={() => updateNews()}
                        >More News</button>
                    }
                    
                </div>
            
            </div>
            
            
            <div id="feed-footer-div">
                <OpenModalButton
                    className="info-modal-button"
                    buttonText={<i className="fa fa-info-circle"></i>}
                    modalComponent={<InfoModal />}
                />
                    
                <NavLink className="footer-p" 
                    to={{pathname: "https://github.com/NRH-AA"}}
                    target="_blank"
                ><i className="fa-brands fa-github"></i></NavLink>
                    
                <NavLink className="footer-p" 
                    to={{pathname: "https://www.linkedin.com/in/nathan-heinz-5b3718231/"}}
                    target="_blank"
                ><i className="fa-brands fa-linkedin"></i></NavLink>
            </div>
        </div>
    );
};

export default Feed;
