import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSearchData } from '../../store/session';

import ProfileButton from './ProfileButton';


import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionTheme = useSelector(state => state.session.theme);
	const sessionSearch = useSelector(state => state.session.search);
	
	const [searchText, setSearchText] = useState('');
	const [searchData, setSearchData] = useState('');
	const [offset, setOffset] = useState(0);
	
	if (!sessionUser) return null;
	
	const searchOptions = ['users', 'jobs', 'companies'];
	
	
	const keyDownSearch = (e) => {
		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			// handleSearch();
		};
	};
	
	const handleInvalidFeature = () => {
		return alert('Feature coming soon!');
	}
	
	const handleSearch = (option) => {
		if (!option) option = 'users';
		
		if (option === 'jobs' || option === 'companies') {
			return handleInvalidFeature();
		};
		
		const searchData = {
			searchType: option,
			searchText,
			offset
		};
		
		dispatch(getSearchData(searchData));
		setSearchText('');
	};
	
	return (
		<div id="navigation-container" data-theme={sessionTheme}>
				
			<div id='navigation-inner-container'>
				<div id="searchbar-input-div" data-theme={sessionTheme}>
					<img id='navigation-logo' src={Logo} alt='EmployMe Logo'
						onClick={() => history.push('/')}
					/>
					
					<div id='searchbar-container'>
						<button id="search-button-submit"
							onClick={() => handleSearch()}
							// onClick={(e) => handleInvalidFeature(e)}
						><i className="fas fa-search"></i></button>
						<input id="searchbar-input" type="text" 
							placeholder='Search'
							value={searchText}
							maxLength={35}
							onKeyDown={(e) => keyDownSearch(e)}
							onChange={(e) => setSearchText(e.target.value)}
							autoFocus
						/>
						
						{searchText && 
							<div id='search-options-container'>
								{searchOptions.map((option, i) =>
									<button key={i} className='search-options-button'
										onClick={() => handleSearch(option)}
									>{`${searchText} `}<span>{`• ${option}`}</span></button>
								)}
							</div>
						}
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
