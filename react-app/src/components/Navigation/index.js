import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSearchedUsers } from '../../store/session';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const [canSearch, setCanSearch] = useState(true);
	const [searchOption, setSearchOption] = useState('name');
	const [search, setSearch] = useState('');

	if (!sessionUser) return null;
	
	const handleSearch = async () => {
		if (!canSearch) return;
		const data = {
			searchType: searchOption,
			searchText: search
		};
		
		setCanSearch(false);
		await dispatch(getSearchedUsers(data));
		setCanSearch(true);
	};
	
	const keyDownSearch = (e) => {
		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		};
	};
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => history.push('/')}/>
				{(sessionPath && sessionPath === '/') && <>
				<select id="search-type-select-box"
					onChange={(e) => setSearchOption(e.target.value)}
				>
					<option value="name">Name</option>
					<option value="email">Email</option>
					<option value="occupation">Occupation</option>
					<option value="posts">Post Count</option>
					<option value="recommendations">Recommendations</option>
				</select>
				
				<button id="search-button-submit"
					onClick={() => handleSearch()}
				>Search</button>
				
				<input id="searchbar-input" type="text" 
					placeholder='Search Bar'
					value={search}
					onKeyDown={(e) => keyDownSearch(e)}
					onChange={(e) => setSearch(e.target.value)}
					autoFocus
				/>
				
				</>}
			</div>
			
			{isLoaded && <ProfileButton user={sessionUser} />}
		</div>
	);
};

export default Navigation;
