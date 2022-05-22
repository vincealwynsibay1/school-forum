import React, { useState } from "react";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { Navigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { email, password } = formData;
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	if (isAuthenticated) {
		<Navigate to='/' />;
	}

	return (
		<section>
			<h1>Sign In</h1>
			<p>Sign Into Your Account</p>
			<form onSubmit={onSubmit}>
				<div>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={onChange}
					/>
				</div>
				<div>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={onChange}
						minLength='6'
					/>
				</div>
				<input type='submit' value='Login' />
			</form>
			<p>
				Don't have an account? <Link to='/register'>Sign Up</Link>
			</p>
		</section>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
