import React, { useEffect } from "react";
import { getProfiles } from "../../actions/profile";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
	useEffect(() => {
		getProfiles();
	}, [getProfiles]);

	if (loading) {
		return <Spinner />;
	}
	return (
		<section>
			<h1>Profiles</h1>
			<p>Browser and Connect with other students</p>
			<div className='profiles'>
				{profiles && profiles.length > 0 ? (
					profiles.map((profile) => (
						<ProfileItem key={profile.user._id} profile={profile} />
					))
				) : (
					<h4>No Profiles Found...</h4>
				)}
			</div>
		</section>
	);
};

Profiles.propTypes = {
	getProfiles: PropTypes.func.isRequired,
	profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
