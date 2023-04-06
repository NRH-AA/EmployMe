import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { setWindowPath } from "../../store/session";
import InfoModal from "./InfoModal";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionPath = useSelector(state => state.session.path);
    
    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath])
    
    if (!sessionUser) return null;
    
    return (
        <div id="feed-container">
            
            <div id="feed-content-container">
            
                <div id="feed-user-profile-data">
                    
                </div>
                
                <div id="feed-posts-container">
                    
                </div>
                
                <div id="feed-news-container">
                    
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
