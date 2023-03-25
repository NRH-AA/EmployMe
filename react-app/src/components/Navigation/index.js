import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './logo.png';

const showInvalidFeature = () => {
	alert('Feature coming soon!');
}

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const sessionPath = useSelector(state => state.session.path);
	const history = useHistory();

	if (!sessionUser) return null;
	
	return (
		<div id="navigation-container">
			<div id="navigation-logo-search-div">
				<img id="navigation-logo" src={Logo} alt="Home" onClick={() => history.push('/')}/>
				{(sessionPath && sessionPath === '/') && 
				<input id="searchbar-input" type="text" 
					placeholder='Search Bar'
					value=""
					onChange={() => {}}
					onClick={() => showInvalidFeature()}
					autoFocus
				/>}
			</div>
			
			{isLoaded && <ProfileButton user={sessionUser} />}
		</div>
	);
};

export default Navigation;
