// constants
const SET_USER = "session/SET_USER";
const SET_ALL_USERS = "session/SET_ALL_USERS";
const SET_SINGLE_USER = "session/SET_SINGLE_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_POSTS = "session/GET_POSTS";
const UPDATE_FEED_POST = "session/UPDATE_POST";
const APPEND_POSTS = "session/APPEND_POSTS";
const GET_NEWS = "session/GET_NEWS";
const CHANGE_THEME = "session/CHANGE_THEME";
const REMOVE_SINGLE_USER = 'session/REMOVE_SINGLE_USER';

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const setAllUsers = (users) => ({
	type: SET_ALL_USERS,
	payload: users
});

const setSingleUserAction = (user) => ({
	type: SET_SINGLE_USER,
	payload: user
});

export const removeSingleUserAction = (user) => ({
	type: REMOVE_SINGLE_USER
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const setPosts = (posts) => ({
	type: GET_POSTS,
	payload: posts
});

const updateFeedPostAction = (data) => ({
	type: UPDATE_FEED_POST,
	post: data
});

const appendPosts = (posts) => ({
	type: APPEND_POSTS,
	payload: posts
});

const setNews = (data) => ({
	type: GET_NEWS,
	data
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

export const updateFeedPostThunk = (postId) => async (dispatch) => {
	const response = await fetch(`/api/posts/${postId}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(updateFeedPostAction(data));
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

export const getPostsThunk = (offset) => async (dispatch) => {
	const response = await fetch(`/api/posts/feed`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			offset: offset || 0
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setPosts(data));
	}
	
	return response
}

export const appendPostsThunk = (offset) => async (dispatch) => {
	const response = await fetch(`/api/posts/feed`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			offset: offset || 0
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(appendPosts(data));
	}
	
	return response
}

export const getSingleUser = (userId) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(setSingleUserAction(data));
	}
	return data
};

export const getJobListing = (id) => async (dispatch) => {
	const response = await fetch(`/api/jobs/${id}`);
	const data = await response.json();
	return data
};

export const updateJobListing = (jobId, jobData) => async (dispatch) => {
	const response = await fetch(`/api/jobs/${jobId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: jobData.title,
			description: jobData.description,
			wageMin: jobData.wageMin,
			wageMax: jobData.wageMax,
			occupation: jobData.occupation,
			openings: jobData.openings,
			filled: jobData.filled
		})
	});

	const data = await response.json();
	dispatch(setSingleUserAction(data));
	return data.job;
};

export const changeJobActiveStatus = (jobId) => async (dispatch) => {
	const response = await fetch(`/api/jobs/${jobId}/active`, {
		method: "POST",
	});

	const data = await response.json();
	return data;
};

export const deleteJobListing = (jobId, userId) => async (dispatch) => {
	const response = await fetch(`/api/jobs/${jobId}`, {
		method: "DELETE",
	});
	
	await dispatch(updateUserInfoThunk(userId));
	
	return response;
};

// export const getSearchResults = (searchData) => async (dispatch) => {
// 	const response = await fetch(`/api/users`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			searchType: searchData.type,
// 			searchText: searchData.text,
// 			offset: searchData.offset
// 		})
// 	});

// 	const data = await response.json();
	
// 	if (response.ok) {
// 		dispatch(setSearchResults(data));
// 	}
	
// 	return data
// };

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

export const createPost = (postData) => async (dispatch) => {
	const response = await fetch(`/api/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: postData.userId,
			text: postData.text,
			urls: postData.urls
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setSingleUserAction(data));
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
		dispatch(setSingleUserAction(data));
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
			postText: postData.postText || false,
			images: postData.images
		})
	});

	const data = await response.json();
	
	if (response.ok) {
		dispatch(setSingleUserAction(data));
	}
	
	return data
};

export const createJobListing = (userId, jobData) => async (dispatch) => {
	const response = await fetch(`/api/jobs`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: userId,
			title: jobData.title,
			description: jobData.description,
			occupation: jobData.occupation,
			wageMin: jobData.wageMin,
			wageMax: jobData.wageMax,
			openings: jobData.openings
		})
	});

	const data = await response.json();
	return data;
};


// const exportNewsDataToApi = (newsData) => async () => {
// 	const response = await fetch(`/api/users/createNewsData`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			newsData
// 		})
// 	});

// 	const data = await response.json();
// 	return data;
// }


export const getNewsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/getNewsData`);
    const data = await res.json();
	dispatch(setNews(data.news));
	return data;
}

const RESET_STATE = 'session/RESET_STATE';
export const resetState = ({
	type: RESET_STATE
});

const initialState = { 
	user: null, 
	users: null,
	singleUser: null,
	posts: null,
	job: null,
	news: null,
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
		case GET_POSTS:
			newState.posts = [...action.payload.posts];
			return newState;
		case APPEND_POSTS:
			newState.posts = [...newState.posts, ...action.payload.posts];
			return newState;
		case UPDATE_FEED_POST:
			newState.posts = [...newState.posts];
			for (let i in newState.posts) {
				const post = newState.posts[i];
				if (post.id === action.post.id) {
					newState.posts[i] = {...action.post};
					return newState;
				}
			}
			return newState;
		case GET_NEWS:
			newState.news = action.data;
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
	}
}
