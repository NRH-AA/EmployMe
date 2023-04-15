import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAllUsersThunk } from '../../store/session';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const sessionTheme = useSelector(state => state.session.theme);
	const [search, setSearch] = useState('');
	
	
	if (!sessionUser) return null;

	
	const keyDownSearch = (e) => {
		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			// handleSearch();
		};
	};
	
	const handleLogoPressed = async () => {
		await dispatch(getAllUsersThunk());
		return history.push('/');
	}
	
	const handleInvalidFeature = () => {
		return alert('Feature coming soon!');
	}
	
	return (
		<div id="navigation-container" data-theme={sessionTheme}>
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={(e) => handleLogoPressed(e)}/>
				
				{sessionPath === '/' && 
				<div id="searchbar-input-div" data-theme={sessionTheme}>
					<input id="searchbar-input" type="text" 
						placeholder='Search Bar'
						value={search}
						maxLength={40}
						onKeyDown={(e) => keyDownSearch(e)}
						onChange={(e) => setSearch(e.target.value)}
						autoFocus
					/>
					<button id="search-button-submit"
						// onClick={() => handleSearch()}
						onClick={(e) => handleInvalidFeature(e)}
					><i className="fas fa-search"></i></button>
				</div>}
				
				<div id="navigation-button-bar-div">
					<button className="navigation-button" type="button"
						title="Home"
						onClick={(e) => history.push('/')}
					><i className="fa-solid fa-house"></i>
					</button>
					
					<button className="navigation-button" type="button"
						title="Jobs"
						onClick={(e) => handleInvalidFeature(e)}
					><i className="fa-solid fa-briefcase"></i></button>
					
					<button className="navigation-button" type="button"
						title="Network"
						onClick={(e) => handleInvalidFeature(e)}
					><i className="fa-solid fa-users"></i></button>
					
					<button className="navigation-button" type="button"
						title="Messages"
						onClick={(e) => handleInvalidFeature(e)}
					><i className='far fa-comment-dots'></i></button>
					
					<button className="navigation-button" type="button"
						title="Notifications"
						onClick={(e) => handleInvalidFeature(e)}
					><i className="fa fa-bell"></i></button>
				</div>
				
			</div>
			
			<div>
				{isLoaded && <ProfileButton user={sessionUser} />}
			</div>
		</div>
	);
};

export default Navigation;
