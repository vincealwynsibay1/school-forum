const Profile = require("../models/Profile");
const asyncHandler = require("express-async-handler");

exports.getCurrent = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user: req.user._id }).populate(
		"user",
		["avatar", "username", "email"]
	);

	if (!profile) {
		return res.status(400).json({
			error: "Profile not Found. Please sign in or sign up.",
		});
	}
	return res.json(profile);
});

exports.getProfileById = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({
		user: req.params.user_id,
	}).populate("user", ["avatar", "username", "email"]);
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

	const profile = await Profile.findOne({ user: req.user._id });

	if (profile.user.toString() !== req.user._id) {
		return res
			.status(401)
			.json({ error: "Cannot update someone else's profile'" });
	}

	if (bio) {
		profile.bio = bio;
	}

	await profile.save();

	return res.json({ profile });
});

exports.follow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user: req.params.user_id });
	console.log(profile);
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}

	if (
		profile.followers.some((f) => f.toString() === req.user._id) ||
		req.params.user_id === req.user._id
	) {
		return res.status(400).json({ message: "User already followed" });
	}

	const currentProfile = await Profile.findOne({ user: req.user._id });

	currentProfile.following.unshift(profile.user);

	profile.followers.unshift(req.user._id);

	await currentProfile.save();
	const updatedProfile = await profile.save();
	return res.json(updatedProfile);
});

exports.unfollow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user: req.params.user_id });
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}
	if (!profile.followers.some((f) => f.toString() === req.user._id)) {
		return res
			.status(400)
			.json({ message: "User has not yet been followed" });
	}

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
