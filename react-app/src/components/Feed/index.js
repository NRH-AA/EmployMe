import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './Feed.css';

const Feed = () => {
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!sessionUser) return null;
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                
                <h2>Feed</h2>
            </div>
            
            
            </div>
        </div>
    );
};

export default Feed;
