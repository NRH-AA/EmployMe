import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


const UserProfileComponent = () => {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const [connections, setConnections] = useState(0);
    const [following, setFollowing] = useState(0);
    
    useEffect(() => {
        if (sessionUser?.connections?.length !== connections) setConnections(sessionUser?.connections?.length);
        if (sessionUser?.following?.length !== connections) setFollowing(sessionUser?.following?.length);
    }, [sessionUser])
    
    return (
    <>
        <img className='feed-user-profile-picture'
            title="Go to your profile"
            src={sessionUser?.profile_picture}
            alt={sessionUser?.first_name}
            onClick={() => history.push(`/profile/${sessionUser?.id}`)}
        />
                    
        <p className='text-primary'>{sessionUser?.first_name + ' ' + sessionUser?.last_name}</p>
                    
        <div id="feed-user-profile-skills-div">
            <p className="text-secondary feed-skill-p">{sessionUser?.occupation}</p>
        </div>
                    
        <div id='feed-user-connections-div'>
            <p className='text-secondary feed-user-connections-p'>Connections: {connections}</p>
            <p className='text-secondary feed-user-connections-p'>Following: {following}</p>
        </div>
    </>
    );
};

export default UserProfileComponent;
