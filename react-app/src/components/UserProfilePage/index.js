import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './UserProfile.css';

const UserProfile = ({user}) => {
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!user) user = sessionUser || ""
    
    if (!user) return null;
    
    return (
        <div id="user-profile-container">
            <div id="user-profile-content-container">
                <div className='user-profile-container'>
                    
                    <div id="user-profile-update-button">
                        {user.id === sessionUser.id && <button>Update</button>}
                    </div>
                    
                    <div id="user-profile-bio-div">
                        <img id="user-profile-picture" src={user?.profile_picture || ""}/>
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
                            <p className="user-qualifications-p">Skills  <button>Update</button></p>
                            <p className="user-qualifications-p">Education  <button>Update</button></p>
                            <p className="user-qualifications-p">Work History  <button>Update</button></p>
                            <p className="user-qualifications-p">Achievements  <button>Update</button></p>
                            <p className="user-qualifications-p">Recommendations  <button>Update</button></p>
                        </div>
                            
                        <div id="user-profile-posts-div">
                            <p>Post One</p>
                            <p>Post Two</p>
                            <p>Post Three</p>
                        </div>
                    
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default UserProfile;
