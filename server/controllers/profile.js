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
	const user = await User.findById(req.params.user_id);
	const profile = Profile.findOne({ user_id: user._id });
	if (!profile) {
		return res.status(400).json({ message: "Profile does not exist." });
	}

	return res.json(profile);
});

exports.getAll = asyncHandler(async (req, res) => {
	const { username, sort } = req.query;
	let profiles = null;
	if (username) {
		profiles = Profile.find({ username: `/.*${username}.*/i` }).populate(
			"user",
			["username"]
		);
	} else {
		profiles = Profile.find().populate("user", ["username"]);
	}

	if (sort) {
		if (sort === "top") {
			profiles = profiles.sort({ followers: -1 });
		}
	}

	return res.json(profiles);
});

exports.create = asyncHandler(async (req, res) => {
	const { user_id, email, username } = req.user;
	const avatar = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });

	const profile = new User({ user_id, avatar, username });
	const savedProfile = await profile.save(err, savedProfile);
	if (!savedProfile) {
		console.log("PROFILE CREATION ERROR");
		return res.status(400).json({ error: "Profile Creation Failed." });
	} else {
		return res.json(savedProfile);
	}
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

	Profile.updateOne(
		{ user_id: req.user._id },
		{ $set: { bio: req.body.bio } }
	);
	res.json(updatedProfile);
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

	const deletedProfile = Profile.deleteOne({ user_id: req.user._id });
	Group.updateOne(
		{ _id: req.params.user_id },
		{ $pull: { user_id: user._id } }
	);
	return res.json(deletedProfile);
});

exports.follow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id });

	if (profile.followers.some((f) => f.toString() === req.user._id)) {
		return res.status(400).json({ message: "User already followed" });
	}

	profile.followers.unshift(req.user._id);

	const savedProfile = await profile.save();
	return res.json(savedProfile);
});

exports.unfollow = asyncHandler(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id });

	if (!profile.followers.some((f) => f.toString() === req.user._id)) {
		return res
			.status(400)
			.json({ message: "User has not yet been followed" });
	}

	profile.followers = profile.followers.filter(
		(f) => f.toString() !== req.user._id
	);

	const savedProfile = await profile.save();
	return res.json(savedProfile);
});
