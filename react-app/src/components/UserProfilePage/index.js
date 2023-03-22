import { useState } from "react";
import { useSelector } from "react-redux";
import Post from './Post';
import './UserProfile.css';

const UserProfile = ({user}) => {
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdating, setIsUpdating] = useState(false);
    
    if (!user) user = sessionUser || null
    
    if (!user) return null;
    
    return (
        <div id="user-profile-container">
            <div id="user-profile-content-container">
                <div className='user-profile-container'>
                    
                    <div id="user-profile-update-button">
                        {(user.id === sessionUser.id && 
                        !isUpdating) ? 
                        <button
                            onClick={() => setIsUpdating(!isUpdating)}
                        >Update</button> :
                        <button
                            onClick={() => setIsUpdating(!isUpdating)}
                        >Submit</button> 
                        }
                    </div>
                    
                    <div id="user-profile-bio-div">
                        <img id="user-profile-picture" src={user?.profile_picture || ""} alt={user?.first_name}/>
                        <div id="user-profile-bio">
                            <div> 
                                <p className="user-profile-p"><b>Name:</b> {user?.first_name} {user?.middle_name} {user?.last_name}</p>
                                <p className="user-profile-p"><b>Age:</b> {user?.age}</p>
                                <p className="user-profile-p"><b>Occupation:</b> {user?.occupation}</p>
                            </div>
                            
                            <div> 
                                <p><b>Company: </b> {user?.company_name}</p>
                                <p><b>Email: </b> {user?.work_email}</p>
                                <p><b>Phone: </b> {user?.phone_number}</p>
                            </div>
                            
                        </div>
                    </div>
                    
                    
                    <div id="user-profile-bottom-div">
                        <div id="user-profile-qualifications">
                            <div className="user-profile-qualification">
                                <p className="user-qualifications-p">SKILLS <button>...</button></p>
                            </div>
                            
                            <div className="user-profile-qualification">
                                <p className="user-qualifications-p">EDUCATION <button>...</button></p>
                            </div>
                            
                            <div className="user-profile-qualification"> 
                                <p className="user-qualifications-p">WORK HIST. <button>...</button></p>
                            </div>
                            
                            <div className="user-profile-qualification">
                                <p className="user-qualifications-p">ACHIEV. <button>...</button></p>
                            </div>
                            
                            <div className="user-profile-qualification">
                                <p className="user-qualifications-p">REC. <button>...</button></p>
                            </div>
                        </div>
                            
                        <div id="user-profile-posts-div">
                            {user?.posts?.map(post => <Post post={post}/>)}
                        </div>
                    
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default UserProfile;
