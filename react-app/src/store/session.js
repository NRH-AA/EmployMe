// constants
const SET_USER = "session/SET_USER";
const SET_ALL_USERS = "session/SET_ALL_USERS";
const SET_SINGLE_USER = "session/SET_SINGLE_USER";
const REMOVE_USER = "session/REMOVE_USER";
const CHANGE_THEME = "session/CHANGE_THEME";
const REMOVE_SINGLE_USER = 'session/REMOVE_SINGLE_USER';
const RESET_STATE = 'session/RESET_STATE';
export const resetState = ({
	type: RESET_STATE
});

export const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

export const setAllUsers = (users) => ({
	type: SET_ALL_USERS,
	payload: users
});

export const setSingleUserAction = (user) => ({
	type: SET_SINGLE_USER,
	payload: user
});

export const removeSingleUserAction = (user) => ({
	type: REMOVE_SINGLE_USER
});

const removeUser = () => ({
	type: REMOVE_USER,
});

export const changeTheme = (theme) => ({
	type: CHANGE_THEME,
	theme
});

export const changeThemeThunk = (userId, theme) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}/theme`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			theme
		})
	});
	
	const data = await response.json();
	
	if (response.ok) {
		dispatch(changeTheme(theme));
		dispatch(setUser(data));
	}
	
	return data;
};

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data;
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (user) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			firstName: user.firstName,
			lastName: user.lastName,
			companyName: user.companyName || '',
			email: user.email,
			work_email: user.workEmail,
			phone_number: user.phone,
			age: user.age,
			username: user.username,
			password: user.password,
			confirmPassword: user.confirmPassword
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

export const updateBioData = (userId, info) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			occupation: info.occupation,
			company_name: info.company_name,
			bio: info.bio
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
		dispatch(setSingleUserAction(data));
	}
	
	return data
};

export const updateProfilePicture = (userId, url) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}/picture`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			profile_picture: url
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
		dispatch(setSingleUserAction(data));
	}
	
	return data
};

export const updateUserInfoThunk = (userId) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(setUser(data));
	}
	return data
}

export const updateUserSkills = (userId, text) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}/skills`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			skills: text
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

export const getAllUsersThunk = () => async (dispatch) => {
	const res = await fetch('/api/users');
    const data = await res.json();
	dispatch(setAllUsers(data))
	return data;
}

export const getSingleUser = (userId) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(setSingleUserAction(data));
	}
	return data
};


export const deleteUserProfileThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/profile`, {
		method: 'DELETE'
	});
	
	const data = await res.json();
	dispatch(setSingleUserAction(data));
	return data;
}

export const updateImages = (userId, postId, images) => async (dispatch) => {
	const response = await fetch(`/api/images`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
			postId: postId,
			images: images
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setSingleUserAction(data));
	}
	
	return data
};





const initialState = { 
	user: null, 
	users: null,
	singleUser: null,
	theme: 'light'
};
export default function reducer(state = initialState, action) {
	let newState = {...state}
	switch (action.type) {
		case SET_USER:
			newState.user = action.payload;
			return newState;
		case REMOVE_USER:
			newState.user = null;
			return newState;
		case SET_ALL_USERS:
			newState.users = action.payload.users;
			return newState;
		case SET_SINGLE_USER:
			newState.singleUser = {...action.payload};
			return newState;
		case CHANGE_THEME:
			newState.theme = action.theme;
			return newState;
		case RESET_STATE:
			newState = initialState;
			return newState
		case REMOVE_SINGLE_USER:
			newState.singleUser = null;
			return newState;
		default:
			return state;
	};
};
