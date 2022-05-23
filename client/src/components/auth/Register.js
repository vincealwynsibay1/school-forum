import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";
import toast from "react-hot-toast";

const Register = ({ register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
		password2: "",
	});
	const { email, username, password, password2 } = formData;
	console.log(isAuthenticated);
	if (isAuthenticated) {
		return <Navigate to='/' />;
	}

	const onChange = (e) => [
		setFormData({ ...formData, [e.target.name]: e.target.value }),
	];

	const onSubmit = (e) => {
		e.preventDefault();
		if (password !== password2) {
			toast.error("Passwords does not match");
		} else {
			register({ email, username, password });
		}
	};

	return (
		<section>
			<h1>Sign Up</h1>
			<p>Create Your Account</p>
			<form onSubmit={onSubmit}>
				<div>
					<input
						type='text'
						name='username'
						placeholder='Username'
						value={username}
						onChange={onChange}
					/>
				</div>
				<div>
					<input
						type='email'
						name='email'
						placeholder='Email Address'
						value={email}
						onChange={onChange}
					/>
				</div>
				<div>
					<input
						type='password'
						name='password'
						placeholder='Password'
						value={password}
						onChange={onChange}
					/>
				</div>
				<div>
					<input
						type='password'
						name='password2'
						placeholder='Confirm Password'
						value={password2}
						onChange={onChange}
					/>
				</div>
				<input type='submit' value='Register' />
			</form>
			<p className='my-1'>
				Already have an account? <Link to='/login'>Sign In</Link>
			</p>
		</section>
	);
};

Register.propTypes = {
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
