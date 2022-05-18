const Profile = require("../models/Profile");
const asyncHandler = require("express-async-handler");

exports.getCurrent = asyncHandler(async (req, res) => {
	// fetches profile of the logged in user
	const profile = await Profile.findOne({ user: req.user._id }).populate(
		"user",
		["avatar", "username", "email"]
	);

	// checks if profile/user exists
	if (!profile) {
		return res.status(400).json({
			error: "Profile not Found. Please sign in or sign up.",
		});
	}
	return res.json(profile);
});

exports.getProfileById = asyncHandler(async (req, res) => {
	// fetches the profile of the logged in user
	const profile = await Profile.findOne({
		user: req.params.user_id,
	}).populate("user", ["avatar", "username", "email"]);

	// checks if the user/profile exists
	if (!profile) {
		return res.status(400).json({ message: "Profile does not exist." });
	}

	return res.json(profile);
});

exports.getAll = asyncHandler(async (req, res) => {
	return res.json(res.paginatedResults);
});

exports.update = asyncHandler(async (req, res) => {
	const { bio, twitter, facebook, instagram } = req.body;

	// fetches the profile of the logged in user
	const profile = await Profile.findOne({ user: req.user._id });

	// checks if the logged in user and the profile the user is trying to update is his/her own
	if (profile.user.toString() !== req.user._id) {
		return res
			.status(401)
			.json({ error: "Cannot update someone else's profile'" });
	}

	/// checks if the bio is inputted
	if (bio) {
		profile.bio = bio;
	}

	await profile.save();

	return res.json({ profile });
});

exports.follow = asyncHandler(async (req, res) => {
	// fetches the profile of the user the logged in user is trying to follow
	const profile = await Profile.findOne({ user: req.params.user_id });

	// checks if the user exists
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}

	// checks if the user is already followed / is already on the following list of the logged in user
	if (
		profile.followers.some((f) => f.toString() === req.user._id) ||
		req.params.user_id === req.user._id
	) {
		return res.status(400).json({ message: "User already followed" });
	}

	// fetches the profile of the logged in user
	const currentProfile = await Profile.findOne({ user: req.user._id });

	// adds the followed user on the following
	currentProfile.following.unshift(profile.user);

	// adds the logged in user on the followers of the user
	profile.followers.unshift(req.user._id);

	await currentProfile.save();
	const updatedProfile = await profile.save();
	return res.json(updatedProfile);
});

exports.unfollow = asyncHandler(async (req, res) => {
	// fetches the profile of the logged in user
	const profile = await Profile.findOne({ user: req.params.user_id });

	// checks if the profile exists
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}

	// checks if the user is not followed yet
	if (!profile.followers.some((f) => f.toString() === req.user._id)) {
		return res
			.status(400)
			.json({ message: "User has not yet been followed" });
	}

	// fetches the user
	const userProfile = await Profile.findOne({ user: req.user._id });

	// remove the user in the current user's following
	userProfile.following = userProfile.following.filter(
		(f) => f.toString() !== profile.user.toString()
	);

	// remove the current user in the user's follower
	profile.followers = profile.followers.filter(
		(f) => f.toString() !== req.user._id
	);
	await userProfile.save();
	const savedProfile = await profile.save();
	return res.json(savedProfile);
});
