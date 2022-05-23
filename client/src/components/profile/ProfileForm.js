import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile } from "../../actions/profile";

const ProfileForm = ({ setShow, updateProfile, profile: { profile } }) => {
	const [formData, setFormData] = useState({ bio: profile.bio });
	const { bio } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		updateProfile(profile.user._id, formData);
		setShow(false);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className=''>
					<textarea
						placeholder='A short bio of yourself'
						name='bio'
						value={bio}
						onChange={onChange}
					/>
				</div>
				<input
					type='submit'
					className='btn btn-primary my-1'
					value='save'
				/>
			</form>
		</div>
	);
};

ProfileForm.propTypes = {
	setShow: PropTypes.func.isRequired,
	updateProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { updateProfile })(ProfileForm);
