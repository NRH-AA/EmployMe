import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionTheme = useSelector(state => state.session.theme);
	const [search, setSearch] = useState('');
	
	
	if (!sessionUser) return null;

	
	const keyDownSearch = (e) => {
		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			// handleSearch();
		};
	};
	
	const handleInvalidFeature = () => {
		return alert('Feature coming soon!');
	}
	
	return (
		<div id="navigation-container" data-theme={sessionTheme}>
				
			<div id='navigation-inner-container'>
				<div id="searchbar-input-div" data-theme={sessionTheme}>
					<img id='navigation-logo' src={Logo} alt='EmployMe Logo'
						onClick={() => history.push('/')}
					/>
					
					<div id='searchbar-container'>
						<button id="search-button-submit"
							// onClick={() => handleSearch()}
							onClick={(e) => handleInvalidFeature(e)}
						><i className="fas fa-search"></i></button>
						<input id="searchbar-input" type="text" 
							placeholder='Search'
							value={search}
							maxLength={35}
							onKeyDown={(e) => keyDownSearch(e)}
							onChange={(e) => setSearch(e.target.value)}
							autoFocus
						/>
					</div>
				</div>
				
				<div id="navigation-button-bar-div">
					
					<div className='navigation-button-div'
						onClick={() => history.push('/')}
					>
						<button className="navigation-button" type="button"
						><i className="fa-solid fa-house"/>
						</button>
						<span>Home</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
						><i className="fa-solid fa-users"></i></button>
						<span>My Network</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
						><i className="fa-solid fa-briefcase"/></button>
						<span>Jobs</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
						><i className='far fa-comment-dots'/></button>
						<span>Messaging</span>
					</div>
					
					<div className='navigation-button-div'
						onClick={(e) => handleInvalidFeature(e)}
					>
						<button className="navigation-button" type="button"
						><i className="fa fa-bell"/></button>
						<span>Notifications</span>
					</div>
					
					<div>
						{isLoaded && <ProfileButton user={sessionUser} />}
					</div>
					
				</div>
			
				<div>
					
				</div>
			
			</div>
		</div>
	);
};

export default Navigation;
