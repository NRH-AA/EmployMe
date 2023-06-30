import { setSingleUserAction } from "./session";

const GET_POSTS = "session/GET_POSTS";
const UPDATE_FEED_POST = "session/UPDATE_POST";
const APPEND_POSTS = "session/APPEND_POSTS";


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

export const updateFeedPostThunk = (postId) => async (dispatch) => {
	const response = await fetch(`/api/posts/${postId}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(updateFeedPostAction(data));
	}
	return data
}


const initialState = { 
	posts: null,
};
export default function reducer(state = initialState, action) {
	let newState = {...state}
	switch (action.type) {
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
				};
			};
			return newState;
		default:
			return state;
	};
};
