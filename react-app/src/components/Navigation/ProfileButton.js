import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import UserJobListingsPage from "./UserJobListingsPage";
import { logout } from "../../store/session";
import CreateJobModal from "./CreateJobModal";
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const sessionTheme = useSelector(state => state.session.theme);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    return history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const handleProfileButton = () => {
    setShowMenu(false);
    return history.push(`/profile/${sessionUser.id}`) 
  }
  
  const showInvalidFeature = () => {
    alert('Feature coming soon!');
}
  
  return (
    <div>
      
      <div id='profile-dropwdown-button-div'
        onClick={openMenu}
      >
        <img id='profile-dropdown-button-img'
            src={sessionUser?.profile_picture}
            alt={sessionUser?.first_name}
        />
        <span className='text-secondary'>Me <i className="fa fa-caret-down"/></span>
      
        <div className={ulClassName} ref={ulRef} data-theme={sessionTheme}>
        {user && (
          <div id="profile-dropdown-container"
            // onMouseLeave={() => {setShowMenu(false)}}
          >
            
            <div id='profile-dropdown-top-div'>
              <img id='profile-dropdown-img'
                src={sessionUser?.profile_picture}
              />
              <div>
                <p className="profile-dropdown-p text-primary">{user?.first_name} {user?.last_name}</p>
                <p className='profile-dropdown-p2 text-secondary'>{user?.bio}</p>
              </div>
            </div>
            
            <div id="profile-dropdown-button-div">
              <button className="profile-dropdown-view-profile-button button-main"
                onClick={() => handleProfileButton()}
              >View Profile</button>
              
              {/* <button className="user-dropdown-button button-main"
                onClick={() => showInvalidFeature()}
              >Company Page</button>
              
              <OpenModalButton
                    className="user-dropdown-button button-main"
                    buttonText="Create Job Listing"
                    modalComponent={<CreateJobModal />}
              />
              
              <OpenModalButton
                  className="user-dropdown-button button-main"
                  buttonText="Job Listings"
                  modalComponent={<UserJobListingsPage />}
              /> */}
              
              
              <button className="user-dropdown-button button-main"
                onClick={handleLogout}
              >Log Out</button>
            </div>
          </div>
        )}
      </div>
      
      </div>
      
      
    </div>
  );
}

export default ProfileButton;
