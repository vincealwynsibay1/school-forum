import {
	USER_LOADED,
	REGISTER_SUCCESS,
	LOGIN_SUCCESS,
	LOGOUT,
	AUTH_ERROR,
	UPDATE_USER,
	ACCOUNT_DELETED,
	USER_ERROR,
} from "../actions/types";

const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: null,
	loading: true,
	user: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_LOADED:
		case UPDATE_USER:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload,
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				loading: false,
			};
		case ACCOUNT_DELETED:
		case LOGOUT:
		case AUTH_ERROR:
		case USER_ERROR:
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null,
			};
		default:
			return state;
	}
};

export default authReducer;
