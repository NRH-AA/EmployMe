import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const [searchOption, setSearchOption] = useState('name');
	const [search, setSearch] = useState('');

	if (!sessionUser) return null;
	
	const showInvalidFeature = () => {
		alert('Feature coming soon!');
	}
	
	
	const handleSearch = async () => {
		
	}
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => history.push('/')}/>
				{(sessionPath && sessionPath === '/') && <>
				<select id="search-type-select-box"
					onChange={(e) => setSearch(e.target.value)}
				>
					<option value="name">Name</option>
					<option value="email">Email</option>
					<option value="occupation">Occupation</option>
					<option value="posts">Post Count</option>
					<option value="recommendations">Recommendations</option>
				</select>
				
				<button id="search-button-submit">Search</button>
				
				<input id="searchbar-input" type="text" 
					placeholder='Search Bar'
					value=""
					onChange={() => {}}
					onClick={() => showInvalidFeature()}
					autoFocus
				/>
				
				</>}
			</div>
			
			{isLoaded && <ProfileButton user={sessionUser} />}
		</div>
	);
};

export default Navigation;
