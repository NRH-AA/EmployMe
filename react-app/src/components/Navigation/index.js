import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSearchResults, getAllUsersThunk } from '../../store/session';
import useLocalStorage from 'use-local-storage';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const sessionTheme = useSelector(state => state.session.theme);
	const [canSearch, setCanSearch] = useState(true);
	const [searchOption, setSearchOption] = useState('Jobs');
	const [search, setSearch] = useState('');
	
	const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

	const switchTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	}
	
	
	if (!sessionUser) return null;
	
	// const handleSearch = async () => {
	// 	if (!canSearch) return;
		
	// 	const searchParams = {
	// 		type: searchOption,
	// 		text: search,
	// 		offset: 0
	// 	}
		
	// 	setCanSearch(false);
	// 	await dispatch(setSearchParams(searchParams));
	// 	await dispatch(getSearchResults(searchParams));
	// 	setCanSearch(true);
	// };
	
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
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => handleLogoPressed()}/>
				
				{sessionPath == '/' && <div id="searchbar-input-div">
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
						onClick={() => handleInvalidFeature()}
					><i className="fas fa-search"></i></button>
				</div>}
				
				<div id="navigation-button-bar-div">
					<button className="navigation-button" type="button"
						title="Home"
						onClick={() => history.push('/')}
					><i className="fa-solid fa-house"></i>
					</button>
					
					<button className="navigation-button" type="button"
						title="Jobs"
						onClick={() => handleInvalidFeature()}
					><i className="fa-solid fa-briefcase"></i></button>
					
					<button className="navigation-button" type="button"
						title="Network"
						onClick={() => handleInvalidFeature()}
					><i className="fa-solid fa-users"></i></button>
					
					<button className="navigation-button" type="button"
						title="Messages"
						onClick={() => handleInvalidFeature()}
					><i className='far fa-comment-dots'></i></button>
					
					<button className="navigation-button" type="button"
						title="Notifications"
						onClick={() => handleInvalidFeature()}
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
