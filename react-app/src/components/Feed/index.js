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
    
    const activeProfiles = sessionUsers?.filter(user => user.active) || null;
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                
                {activeProfiles && activeProfiles.map(user => <div key={user.id}>
                    <NavLink className="user-feed-info-div" to={`/profile/${user.id}`}>
                        <img className="feed-profile-picture" src={user.profile_picture} alt={user.first_name}/>
                    <div class="user-feed-info-data-div">
                        <div>
                            <p className="feed-info-p">Name: <span>{user.first_name} {user.middle_name} {user.last_name}</span></p>
                            <p className="feed-info-p">Email: <span>{user.work_email}</span></p>
                            <p className="feed-info-p">Occupation: <span>{user.occupation}</span></p>
                        </div>
                        
                        <div>
                            <p className="feed-info-p">Posts: <span>{user.posts.length}</span></p>
                            <p className="feed-info-p">Reccomendations: <span>0</span></p>
                            <p className="feed-info-p">Messages: <span>{user.messages.length}</span></p>
                        </div>
                    </div>
                    </NavLink>
                </div>
                )}
            </div>
            
            
            </div>
        </div>
    );
};

export default Feed;
