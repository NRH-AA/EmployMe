import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const history = useHistory();
	
	if (!sessionUser) return null;
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => history.push('/')}/>
				<input id="searchbar-input" type="text" placeholder='Search Bar'/>
			</div>
			
			{isLoaded && <ProfileButton user={sessionUser} />}
		</div>
	);
};

export default Navigation;
