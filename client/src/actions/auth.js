import api from "../utils/api";

import {
	USER_LOADED,
	REGISTER_SUCCESS,
	LOGIN_SUCCESS,
	LOGOUT,
	AUTH_ERROR,
	USER_ERROR,
} from "../actions/types";
import { ACCOUNT_DELETED, UPDATE_USER } from "./types";
import toast from "react-hot-toast";

export const loadUser = () => async (dispatch) => {
	try {
		const res = await api.get("/auth");
		console.log(res.data);
		dispatch({ type: USER_LOADED, payload: res.data });
	} catch (err) {
		dispatch({ type: AUTH_ERROR });
	}
};

export const register = (formData) => async (dispatch) => {
	try {
		const res = await api.post("/auth/register", formData);

		dispatch({ type: REGISTER_SUCCESS, payload: res.data });
		toast.success("User registered");
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg));
		}
	}
};
export const login = (email, password) => async (dispatch) => {
	try {
		const res = await api.post("/auth/login", { email, password });

		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		toast.success("User logged in");
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg));
		}
	}
};

export const logout = () => ({ type: LOGOUT });

// Update User
export const updateUser = (user_id, formData) => async (dispatch) => {
	try {
		const res = await api.put(`/users/${user_id}`, formData);
		dispatch({ type: UPDATE_USER, payload: res.data });
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// Update User Avatar
export const updateAvatar = (user_id, file) => async (dispatch) => {
	try {
		const res = await api.put(`/users/${user_id}/avatar`, file);
		dispatch({ type: UPDATE_USER, payload: res.data });
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// Delete User
export const deleteUser = (user_id) => async (dispatch) => {
	try {
		const res = await api.delete(`/users/${user_id}`);

		dispatch({ type: ACCOUNT_DELETED });
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};
