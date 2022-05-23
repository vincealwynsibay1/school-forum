import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import ProfileAbout from "./ProfileAbout";

const Profile = ({ getProfileById, profile: { profile }, auth }) => {
	const { id } = useParams();
	useEffect(() => {
		getProfileById(id);
	}, [getProfileById, id]);

	return (
		<section>
			{profile === null ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to={`/profiles`}>Back to Profiles</Link>
					<div className=''></div>
					<div className=''>
						<ProfileAbout profile={profile} auth={auth} />
					</div>
				</Fragment>
			)}
		</section>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object,
	auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
