// constants
const SET_USER = "session/SET_USER";
const SET_ALL_USERS = "session/SET_ALL_USERS";
const SET_SINGLE_USER = "session/SET_SINGLE_USER";
const SET_SEARCHED_USERS = "session/SET_SEARCHED_USERS";
const REMOVE_USER = "session/REMOVE_USER";
const SET_PATH = "session/SET_PATH";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const setAllUsers = (users) => ({
	type: SET_ALL_USERS,
	payload: users
});

const setSingleUser = (user) => ({
	type: SET_SINGLE_USER,
	payload: user
});

const setSearchedUsers = (users) => ({
	type: SET_SEARCHED_USERS,
	payload: users
});

const removeUser = () => ({
	type: REMOVE_USER,
});

export const setWindowPath = (path) => ({
	type: SET_PATH,
	path
});

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
			age: user.age,
			username: user.username,
			password: user.password,
			confirmPassword: user.confirmPassword
		}),
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
			first_name: info.first_name,
			middle_name: info.middle_name,
			last_name: info.last_name,
			age: info.age,
			occupation: info.occupation,
			company_name: info.company_name,
			work_email: info.work_email,
			phone_number: info.phone_number
		}),
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
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
	}
	
	return data
};

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
		dispatch(setSingleUser(data));
	}
	return data
};

export const getSearchedUsers = (searchData) => async (dispatch) => {
	const response = await fetch(`/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			searchType: searchData.searchType,
			searchText: searchData.searchText
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setSearchedUsers(data));
	}
	
	return data
};

export const deleteUserProfileThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/profile`, {
		method: 'DELETE'
	});
	
	const data = await res.json();
	dispatch(setUser(data))
	return data;
}

export const updateImages = (userId, images) => async (dispatch) => {
	const response = await fetch(`/api/images`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
			images: images
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

export const createPost = (postData) => async (dispatch) => {
	const response = await fetch(`/api/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: postData.userId,
			title: postData.title,
			text: postData.text,
			urls: postData.urls
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

export const deletePost = (postId, userId) => async (dispatch) => {
	const response = await fetch(`/api/posts/${postId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

export const updatePost = (postId, userId, postData) => async (dispatch) => {
	const response = await fetch(`/api/posts/${postId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
			postTitle: postData.postTitle || false,
			postText: postData.postText || false
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setUser(data));
	}
	
	return data
};

const initialState = { user: null, users: null, searchedUsers: null, path: null };
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
			newState.searchedUsers = null;
			newState.users = action.payload.users;
			return newState;
		case SET_SINGLE_USER:
			newState.users = action.payload;
			return newState;
		case SET_SEARCHED_USERS:
			newState.searchedUsers = action.payload.users;
			return newState;
		case SET_PATH:
			newState.path = action.path;
			return newState;
		default:
			return state;
	}
}
