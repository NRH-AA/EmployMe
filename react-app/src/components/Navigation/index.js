import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	
	if (!sessionUser) return null;
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} />
				<input id="searchbar-input" type="text" placeholder='Search Bar'/>
			</div>
			
			{isLoaded && <ProfileButton user={sessionUser} />}
		</div>
	);
};

export default Navigation;
