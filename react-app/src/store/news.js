const GET_NEWS = "session/GET_NEWS";



const setNews = (data) => ({
	type: GET_NEWS,
	data
});




export const getNewsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/getNewsData`);
    const data = await res.json();
	dispatch(setNews(data.news));
	return data;
}



const initialState = { 
	news: null,
};
export default function reducer(state = initialState, action) {
	let newState = {...state}
	switch (action.type) {
		case GET_NEWS:
			newState.news = action.data;
			return newState;
		default:
			return state;
	};
};
