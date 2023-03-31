import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSearchResults, getAllUsersThunk } from '../../store/session';
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
	const [offset, setOffset] = useState(0);

	if (!sessionUser) return null;
	
	const handleSearch = async () => {
		if (!canSearch) return;
		const data = {
			searchType: searchOption,
			searchText: search,
			offset
		};
		
		setCanSearch(false);
		await dispatch(getSearchResults(data));
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
				{(sessionPath && sessionPath === '/') && <>
				<button id="search-type-select-box"
					onClick={() => setShowSearchTypes(!showSearchTypes)}
				><i className="fa fa-caret-down"></i><span>{searchOption}</span></button>
				
				{showSearchTypes &&
					<div id="search-drop-down-div"
						onMouseLeave={() => setShowSearchTypes(false)}
					>
						<p className="search-drop-down-p"
							onClick={() => {setSearchOption('Jobs'); setShowSearchTypes(!showSearchTypes)}}
						>Jobs</p>
						<p className="search-drop-down-p"
							onClick={() => {setSearchOption('Companies'); setShowSearchTypes(!showSearchTypes)}}
						>Companies</p>
						<p className="search-drop-down-p"
							onClick={() => {setSearchOption('Users'); setShowSearchTypes(!showSearchTypes)}}
						>Users</p>
					</div>
				}
				
				<button id="search-button-submit"
					onClick={() => handleSearch()}
				><i className="fas fa-search"></i></button>
				
				<input id="searchbar-input" type="text" 
					placeholder='Search Bar'
					value={search}
					maxLength={100}
					onKeyDown={(e) => keyDownSearch(e)}
					onChange={(e) => setSearch(e.target.value)}
					autoFocus
				/>
				
				</>}
			</div>
			
			<div>
				<OpenModalButton
                    className="create-job-listing-button"
                    buttonText="Create Job Listing"
                    modalComponent={<CreateJobModal />}
                />
				{isLoaded && <ProfileButton user={sessionUser} />}
			</div>
		</div>
	);
};

export default Navigation;
