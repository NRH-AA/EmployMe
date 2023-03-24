import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllUsersThunk } from "../../store/session";
import './Feed.css';
import { useEffect } from "react";

const Feed = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionUsers = useSelector((state) => state.session.users);
    
    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch])
    
    if (!sessionUsers) {
        dispatch(getAllUsersThunk());
    }
    
    if (!sessionUser) return null;
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                
                <h2>Feed</h2>
                {sessionUsers && sessionUsers.map(singleUser => {
                    if (singleUser.active) {
                        return <div key={singleUser.id}>
                            <NavLink to={`/profile/${singleUser.id}`}>{singleUser.first_name}</NavLink><br></br>
                        </div>
                    }
                    return ""
                })}
            </div>
            
            
            </div>
        </div>
    );
};

export default Feed;
