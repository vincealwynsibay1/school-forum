import {
	GET_PROFILE,
	GET_PROFILES,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	PROFILE_ERROR,
} from "../actions/types";
import api from "../utils/api";

export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await api.get("/profile/me");

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const getProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });

	try {
		const res = await api.get("/profile");

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};
export const getProfileById = (userId) => async (dispatch) => {
	try {
		const res = await api.get(`/profile/${userId}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// Follow User
export const followProfile = (userId) => async (dispatch) => {
	try {
		const res = await api.put(`/profile/${userId}/follow`);
		console.log(res.data);
		dispatch({ type: UPDATE_PROFILE, payload: res.data });
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};
// Unfollow
export const unfollowProfile = (userId) => async (dispatch) => {
	try {
		const res = await api.put(`/profile/${userId}/unfollow`);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// Update
export const updateProfile = (userId, formData) => async (dispatch) => {
	try {
		const res = await api.put(`/profile/${userId}`, formData);
		console.log(res);
		dispatch({ type: UPDATE_PROFILE, payload: res.data });
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};
