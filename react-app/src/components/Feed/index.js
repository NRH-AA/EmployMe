import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { getAllUsersThunk, setWindowPath } from "../../store/session";
import InfoModal from "./InfoModal";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionUsers = useSelector((state) => state.session.users);
    const sessionSearchedUsers = useSelector((state) => state.session.searchedUsers);
    const sessionPath = useSelector(state => state.session.path);
    
    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath])
    
    useEffect(() => {
        if (!sessionUsers?.length > 0) dispatch(getAllUsersThunk());
    }, [dispatch, sessionUsers])
    
    if (!sessionUser) return null;
    
    
    let activeProfiles
    if (sessionSearchedUsers) {
        console.log(sessionSearchedUsers);
        activeProfiles = sessionSearchedUsers?.filter(user => user.active && user.id !== sessionUser?.id);
    } else {
        activeProfiles = sessionUsers?.length > 0 && sessionUsers?.filter(user => user.active && user.id !== sessionUser?.id);
    }
    
    if (!activeProfiles) {
        dispatch(getAllUsersThunk())
    }
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                
                {activeProfiles && activeProfiles.map(user => 
                <div key={user.id}>
                    <NavLink className="user-feed-info-div" to={`/profile/${user.id}`}>
                        <img className="feed-profile-picture" src={user.profile_picture} alt={user.first_name}/>
                    <div className="user-feed-info-data-div">
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
