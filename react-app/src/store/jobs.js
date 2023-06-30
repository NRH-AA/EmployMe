


// export const getJobListing = (id) => async (dispatch) => {
// 	const response = await fetch(`/api/jobs/${id}`);
// 	const data = await response.json();
// 	return data
// };

// export const createJobListing = (userId, jobData) => async (dispatch) => {
// 	const response = await fetch(`/api/jobs`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			userId: userId,
// 			title: jobData.title,
// 			description: jobData.description,
// 			occupation: jobData.occupation,
// 			wageMin: jobData.wageMin,
// 			wageMax: jobData.wageMax,
// 			openings: jobData.openings
// 		})
// 	});

// 	const data = await response.json();
// 	return data;
// };

// export const updateJobListing = (jobId, jobData) => async (dispatch) => {
// 	const response = await fetch(`/api/jobs/${jobId}`, {
// 		method: "PUT",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			title: jobData.title,
// 			description: jobData.description,
// 			wageMin: jobData.wageMin,
// 			wageMax: jobData.wageMax,
// 			occupation: jobData.occupation,
// 			openings: jobData.openings,
// 			filled: jobData.filled
// 		})
// 	});

// 	const data = await response.json();
// 	dispatch(setSingleUserAction(data));
// 	return data.job;
// };

// export const changeJobActiveStatus = (jobId) => async (dispatch) => {
// 	const response = await fetch(`/api/jobs/${jobId}/active`, {
// 		method: "POST",
// 	});

// 	const data = await response.json();
// 	return data;
// };

// export const deleteJobListing = (jobId, userId) => async (dispatch) => {
// 	const response = await fetch(`/api/jobs/${jobId}`, {
// 		method: "DELETE",
// 	});
	
// 	await dispatch(updateUserInfoThunk(userId));
	
// 	return response;
// };

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



const initialState = { 
	job: null,
};
export default function reducer(state = initialState, action) {
	let newState = {...state}
	switch (action.type) {
		default:
			return newState;
	};
};
