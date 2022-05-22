import api from "../utils/api";

import {
	USER_LOADED,
	REGISTER_SUCCESS,
	LOGIN_SUCCESS,
	LOGOUT,
	AUTH_ERROR,
} from "../actions/auth";

export const loadUser = () => async (dispatch) => {
	try {
		const res = await api.get("/auth");
		dispatch({ type: USER_LOADED, payload: res.data });
	} catch (err) {
		dispatch({ type: AUTH_ERROR });
	}
};

export const register = (formData) => async (dispatch) => {
	try {
		const res = await api.post("/auth/register", formData);

		dispatch({ type: REGISTER_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			// errors.forEach(error => )
		}
	}
};
export const login = (email, password) => async (dispatch) => {
	try {
		const res = await api.post("/auth/register", { email, password });

		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			// errors.forEach(error => )
		}
	}
};

export const logout = () => ({ type: LOGOUT });
