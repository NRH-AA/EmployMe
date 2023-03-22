// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const initialState = { user: null };

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


export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		default:
			return state;
	}
}
