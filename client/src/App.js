import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// components
import PrivateRoute from "./components/routing/PrivateRoute";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

// utils
import setAuthToken from "./utils/setAuthToken";
import store from "./app/store";
import { loadUser, logout } from "./actions/auth";

const App = () => {
	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}

		store.dispatch(loadUser());

		window.addEventListener("storage", () => {
			if (!localStorage.token) store.dispatch(logout());
		});
	});

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Landing />} />
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
				<Route path='profiles' element={<Profiles />} />
				<Route path='profile/:id' element={<Profile />} />
				// Private Routes
			</Routes>

			<Toaster />
		</Router>
	);
};

export default App;
