const User = require("../models/User");
const Profile = require("../models/Profile");
const gravatar = require("gravatar");
const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");

exports.getCurrent = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id })
		.populate("posts")
		.populate("comments")
		.populate("groups")
		.populate("following")
		.populate("followers");

	if (!profile) {
		return res.status(400).json({
			error: "Profile not Found. Please sign in or sign up.",
		});
	}
	return res.json(profile);
});

exports.getProfileById = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.params.user_id })
		.populate("posts")
		.populate("comments")
		.populate("groups")
		.populate("following")
		.populate("followers");
	if (!profile) {
		return res.status(400).json({ message: "Profile does not exist." });
	}

	return res.json(profile);
});

exports.getAll = asyncHandler(async (req, res) => {
	return res.json(res.paginatedResults);
});

exports.updateBio = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id });

	if (!profile) {
		return res.status(400).json({ error: "Profile does not exist" });
	}

	if (profile.user_id !== req.user._id) {
		return res
			.status(401)
			.json({ error: "Cannot update someone else's profile'" });
	}
	profile.bio = req.body.bio;

	const updatedProfile = await profile.save();

	res.json(updatedProfile);
});

exports.updateAvatar = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id });

	if (!profile) {
		return res.status(400).json({ error: "Profile does not exist" });
	}

	if (profile.user_id !== req.user._id) {
		return res
			.status(401)
			.json({ erorr: "Cannot update someone else's profile" });
	}

	if (req.file) {
		return res.status.json({ error: "Missing files." });
	}

	profile.avatar = { url: req.file.path, fileName: req.file.fileName };

	const updatedProfile = await profile.save();
	return res.json(updatedProfile);
});

exports.deleteProfile = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id });

	if (!profile) {
		return res.status(400).json({ error: "Profile does not exist" });
	}

	if (profile.user_id !== req.user._id) {
		return res
			.status(401)
			.json({ error: "Cannot update someone else's profile'" });
	}

	await Profile.deleteOne({ user_id: req.user._id });
	return res.json({ message: "Successfully deleted the profile" });
});

exports.follow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.params.user_id });
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}
	if (
		profile.followers.some((f) => f.toString() === req.user._id) &&
		req.params.user_id !== req.user._id
	) {
		return res.status(400).json({ message: "User already followed" });
	}

	await Profile.findByIdAndUpdate(req.user._id, {
		$push: { following: req.params.user_id },
	});
	const currentProfile = await Profile.findOne({ user_id: req.user._id });
	currentProfile.following.unshift(profile.user_id);

	profile.followers.unshift(req.user._id);

	await currentProfile.save();
	const savedProfile = await profile.save();
	return res.json(savedProfile);
});

exports.unfollow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.params.user_id });
	if (!profile) {
		return res.status(400).json({ error: "User does not exist." });
	}
	if (!profile.followers.some((f) => f.toString() === req.user._id)) {
		return res
			.status(400)
			.json({ message: "User has not yet been followed" });
	}

	const userProfile = await Profile.findOne({ user_id: req.user._id });
	// remove the user in the current user's following
	userProfile.following = userProfile.following.filter(
		(f) => f.toString() !== profile.user_id.toString()
	);

	// remove the current user in the user's follower
	profile.followers = profile.followers.filter(
		(f) => f.toString() !== req.user._id
	);
	await userProfile.save();
	const savedProfile = await profile.save();
	return res.json(savedProfile);
});
