import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


const UserProfileComponent = () => {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const [connections, setConnections] = useState(0);
    
    useEffect(() => {
        if (sessionUser?.connections?.length !== connections) setConnections(sessionUser?.connections?.length);
    }, [sessionUser])
    
    const userSkillArray = sessionUser?.skills?.split(';') || [];
    
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
            {userSkillArray && userSkillArray.map((skill, i) =>
                <p key={i} className="text-secondary feed-skill-p">{skill}</p>
            )}
        </div>
                    
        <div id='feed-user-connections-div'>
            <h4 className='text-primary'>Connections {connections}</h4>
        </div>
    </>
    );
};

export default UserProfileComponent;
