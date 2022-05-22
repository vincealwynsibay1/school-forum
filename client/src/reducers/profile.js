import {
	GET_PROFILE,
	GET_PROFILES,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	PROFILE_ERROR,
} from "../actions/types";

const initialState = {
	profile: null,
	profiles: null,
	loading: true,
	error: {},
};

const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_PROFILE:
		case UPDATE_PROFILE:
			return {
				...state,
				profile: action.payload,
				loading: false,
			};
		case GET_PROFILES:
			return {
				...state,
				profiles: action.payload,
				loading: false,
			};
		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
			};
		case PROFILE_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
				profile: null,
			};
		default:
			return state;
	}
};

export default profileReducer;
