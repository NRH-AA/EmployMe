import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { setWindowPath, getPostsThunk, appendPostsThunk } from "../../store/session";
import InfoModal from "./InfoModal";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    const posts = useSelector(state => state.session.posts)
    const [offset, setOffset] = useState(0);
    
    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath]);
    
    useEffect(() => {
        if (!posts?.length) dispatch(getPostsThunk());
    }, [dispatch, posts]);
    
    if (!sessionUser) return null;
    
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
                    
                    <div>
                        <p></p>
                    </div>
                    
                </div>
                
                <div id="feed-posts-container">
                    {posts?.length && posts?.map((post, i) => <div key={i} className="feed-post-container">
                        <div className="feed-post-top-div"> 
                            <img src={post.user.profile_picture} alt={post.user.first_name}/>
                            <h4><b>{post.post_title}</b></h4>
                        </div>
                        
                        <div className="feed-post-text-div">
                            <p>{post.post_text}</p>
                        </div>
                    
                    </div>)}
                    
                    <button
                        onClick={() => {setOffset(offset + 6); dispatch(appendPostsThunk(offset))}}
                    >See more</button>
                </div>
                
                <div id="feed-news-container">
                    <div id="feed-news-div">
                        <h2>News</h2>
                        <p>No news today.</p>
                    </div>
                    
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
