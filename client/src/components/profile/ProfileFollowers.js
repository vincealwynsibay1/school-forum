import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
const ProfileFollowers = ({ getProfileById, profile: { profile } }) => {
	const { id } = useParams();
	useEffect(() => {
		getProfileById(id);
	}, [getProfileById, id]);
	return (
		<div>
			{profile === null ? (
				<Spinner />
			) : (
				<Fragment>
					{profile.followers.length > 0 &&
						profile.followers.map((follower) => (
							<div key={follower._id}>
								<img
									src={follower.avatar && follower.avatar.url}
									alt=''
								/>
								<div className=''>
									<h3>{follower.username}</h3>
									<Link to={`/profile/${follower._id}`}>
										View Profile
									</Link>
								</div>
							</div>
						))}
				</Fragment>
			)}
		</div>
	);
};

ProfileFollowers.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfileById })(ProfileFollowers);
