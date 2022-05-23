import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
const ProfileFollowing = ({ getProfileById, profile: { profile } }) => {
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
					{profile.following.length > 0 &&
						profile.following.map((f) => (
							<div key={f._id}>
								<img src={f.avatar && f.avatar.url} alt='' />
								<div className=''>
									<h3>{f.username}</h3>
									<Link to={`/profile/${f._id}`}>
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

ProfileFollowing.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfileById })(ProfileFollowing);
