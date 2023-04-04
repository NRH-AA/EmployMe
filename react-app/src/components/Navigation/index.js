import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSearchResults, getAllUsersThunk, setSearchParams } from '../../store/session';
import ProfileButton from './ProfileButton';
import OpenModalButton from "../OpenModalButton";
import CreateJobModal from './CreateJobModal';
import './Navigation.css';
import Logo from './logo.png';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const [canSearch, setCanSearch] = useState(true);
	const [searchOption, setSearchOption] = useState('Jobs');
	const [showSearchTypes, setShowSearchTypes] = useState(false);
	const [search, setSearch] = useState('');

	if (!sessionUser) return null;
	
	const handleSearch = async () => {
		if (!canSearch) return;
		
		const searchParams = {
			type: searchOption,
			text: search,
			offset: 0
		}
		
		setCanSearch(false);
		await dispatch(setSearchParams(searchParams));
		await dispatch(getSearchResults(searchParams));
		setCanSearch(true);
	};
	
	const keyDownSearch = (e) => {
		if (e.key === 'Tab' || e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		};
	};
	
	const handleLogoPressed = async () => {
		await dispatch(getAllUsersThunk());
		return history.push('/');
	}
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => handleLogoPressed()}/>
				
				{sessionPath == '/' && <div id="searchbar-input-div">
					<input id="searchbar-input" type="text" 
						placeholder='Search Bar'
						value={search}
						maxLength={100}
						onKeyDown={(e) => keyDownSearch(e)}
						onChange={(e) => setSearch(e.target.value)}
						autoFocus
					/>
					<button id="search-button-submit"
						onClick={() => handleSearch()}
					><i className="fas fa-search"></i></button>
				</div>}
				
			</div>
			
			<div>
				{isLoaded && <ProfileButton user={sessionUser} />}
			</div>
		</div>
	);
};

export default Navigation;
