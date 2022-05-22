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
// Unfollow
// Update
