import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
	profile: {
		user: { _id, username, avatar },
	},
}) => {
	return (
		<div>
			<div className=''>
				<img src={avatar && avatar.url} alt='' />
				<div className=''>
					<h3>{username}</h3>
					<Link to={`/profile/${_id}`}>View Profile</Link>
				</div>
			</div>
		</div>
	);
};

ProfileItem.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileItem;
