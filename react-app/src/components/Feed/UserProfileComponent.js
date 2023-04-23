import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./UserProfile.css";

const UserProfileComponent = () => {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const [connections, setConnections] = useState(0);
    const [following, setFollowing] = useState(0);
    const [hoveringImage, setHoveringImage] = useState(false);
    
    useEffect(() => {
        if (sessionUser?.connections?.length !== connections) setConnections(sessionUser?.connections?.length);
        if (sessionUser?.following?.length !== connections) setFollowing(sessionUser?.following?.length);
    }, [sessionUser])
    
    return (
    <div id='feed-user-profile-container'>
        <img id='feed-user-cover-image'
            src='https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg'
            alt='Cover'
        />
        
        <div id='feed-user-profile-content-container'>
            <div id='feed-user-profile-content-top'
                onMouseEnter={() => setHoveringImage(true)}
                onMouseLeave={() => setHoveringImage(false)}
                onClick={() => history.push(`/profile/${sessionUser?.id}`)}
            >
                <img className='feed-user-profile-picture'
                    title="Go to your profile"
                    src={sessionUser?.profile_picture}
                    alt={sessionUser?.first_name}
                />
                            
                <p style={{marginTop: "20px", marginBottom: "0px"}}
                    className={!hoveringImage ? 'text-primary' : 'text-primary feed-user-profile-name-link'}>
                    {sessionUser?.first_name + ' ' + sessionUser?.last_name}
                </p>
            </div>
                   
            <div id="feed-user-profile-bio-div">
                <p className="text-secondary feed-bio-p">{sessionUser?.bio}</p>
            </div>
                        
            <div id='feed-user-connections-div'>
                <p className='text-secondary feed-user-connections-p'>Connections: {connections}</p>
                <p className='text-secondary feed-user-connections-p'>Following: {following}</p>
            </div>
        </div>
    </div>
    );
};

export default UserProfileComponent;
