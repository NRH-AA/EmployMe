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

  const handleLogout = async (e) => {
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
    <div id="profile-dropdown-div">
      <button id="profile-dropdown-button" onClick={openMenu}>
        <i className="fa-solid fa-circle-user fa-2xl"></i>
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user && (
          <div id="profile-dropdown-container"
            onMouseLeave={() => {setShowMenu(false)}}
          >
            <p className="profile-dropdown-p">Welcome, {user?.first_name} {user?.last_name}</p>
            
            <div id="profile-dropdown-button-div">
              <button className="user-dropdown-button"
                onClick={() => handleProfileButton()}
              >Profile Page</button>
              
              <button className="user-dropdown-button"
                onClick={() => showInvalidFeature()}
              >Company Page</button>
              
              <OpenModalButton
                    className="user-dropdown-button"
                    buttonText="Create Job Listing"
                    modalComponent={<CreateJobModal />}
              />
              
              <OpenModalButton
                  className="user-dropdown-button"
                  buttonText="Job Listings"
                  modalComponent={<UserJobListingsPage />}
              />
              
              
              
              <button className="user-dropdown-button"
                onClick={handleLogout}
              >Log Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
