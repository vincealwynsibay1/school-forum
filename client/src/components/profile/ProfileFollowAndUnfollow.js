import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { followProfile, unfollowProfile } from "../../actions/profile";

const ProfileFollowAndUnfollow = ({
	followProfile,
	unfollowProfile,
	profile: { followers, user },
	auth,
}) => {
	const follow = (e) => {
		e.preventDefault();
		followProfile(user._id);
	};

	const unfollow = (e) => {
		e.preventDefault();
		unfollowProfile(user._id);
	};

	if (followers && !followers.some((f) => f._id === auth.user._id)) {
		return (
			<button type='button' onClick={follow}>
				Follow
			</button>
		);
	} else {
		return (
			<button type='button' onClick={unfollow}>
				Unfollow
			</button>
		);
	}
};

ProfileFollowAndUnfollow.propTypes = {
	followProfile: PropTypes.func.isRequired,
	unfollowProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { followProfile, unfollowProfile })(
	ProfileFollowAndUnfollow
);
