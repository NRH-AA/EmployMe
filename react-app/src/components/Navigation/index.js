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
				
				
				<div id="searchbar-input-div" data-theme={sessionTheme}>
					<img id='navigation-logo' src={Logo} alt='EmployMe Logo'
						onClick={() => history.push('/')}
					/>
					
					{sessionPath === '/' && 
					<div id='searchbar-container'>
						<button id="search-button-submit"
							// onClick={() => handleSearch()}
							onClick={(e) => handleInvalidFeature(e)}
						><i className="fas fa-search"></i></button>
						<input id="searchbar-input" type="text" 
							placeholder='Search Bar'
							value={search}
							maxLength={40}
							onKeyDown={(e) => keyDownSearch(e)}
							onChange={(e) => setSearch(e.target.value)}
							autoFocus
						/>
					</div>}
				</div>
				
				<div id="navigation-button-bar-div">
					
					<div className='navigation-button-div'
						onClick={() => history.push('/')}
					>
						<button className="navigation-button" type="button"
							title="Home"
						><i className="fa-solid fa-house"/>
						</button>
						<span>Home</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
							title="Network"
						><i className="fa-solid fa-users"></i></button>
						<span>My Network</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
							title="Jobs"
						><i className="fa-solid fa-briefcase"/></button>
						<span>Jobs</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
							title="Messages"
						><i className='far fa-comment-dots'/></button>
						<span>Messaging</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
							title="Notifications"
						><i className="fa fa-bell"/></button>
						<span>Notifications</span>
					</div>
					
				</div>
			
			<div>
				{isLoaded && <ProfileButton user={sessionUser} />}
			</div>
		</div>
	);
};

export default Navigation;
