import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileFollowAndUnfollow from "./ProfileFollowAndUnfollow";
import ProfileForm from "./ProfileForm";

const ProfileAbout = ({ profile, auth }) => {
	const [show, setShow] = useState(false);
	return (
		<div>
			<div className=''>
				<img
					className='round-img my-1'
					src={profile.user.avatar.url}
					alt=''
				/>
				<h1>{profile.user.username}</h1>
				<p>{profile.user.email}</p>
				{auth.isAuthenticated &&
					!auth.loading &&
					auth.user._id !== profile.user._id && (
						<ProfileFollowAndUnfollow profile={profile} />
					)}
			</div>
			<div className=''>
				<div className=''>
					<h2>{profile.user.username}'s Bio </h2>
					<p>{profile.bio}</p>
					{auth.isAuthenticated &&
						!auth.loading &&
						auth.user._id === profile.user._id && (
							<Fragment>
								{show ? (
									<ProfileForm
										id={profile.user._id}
										bio={profile.bio}
										setShow={setShow}
									/>
								) : (
									<button
										type='button'
										onClick={() => setShow(true)}
									>
										Edit Bio
									</button>
								)}
							</Fragment>
						)}
				</div>

				<div className=''>
					<div className=''>
						<Link to={`/profile/${profile.user._id}/followers`}>
							<p>
								{profile.followers && profile.followers.length}{" "}
								Followers
							</p>
						</Link>
					</div>
					<div className=''>
						<Link to={`/profile/${profile.user._id}/following`}>
							<p>
								{profile.following && profile.following.length}{" "}
								Following
							</p>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

ProfileAbout.propTypes = {
	profile: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool,
};

export default ProfileAbout;
