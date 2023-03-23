import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/session";
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
    await dispatch(logout());
    return history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const handleProfileButton = () => {
    setShowMenu(false);
    return history.push(`/profile/${sessionUser.id}`) 
  }
  
  return (
    <>
      <button id="profile-dropdown-button" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user && (
          <div id="profile-dropdown-container">
            <p>{user.username}</p>
            <p>{user.email}</p>
            <button onClick={() => handleProfileButton()}>Profile Page</button>
            <button>Company Page</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
