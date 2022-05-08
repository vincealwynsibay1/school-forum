const User = require("../models/User");
const Profile = require("../models/Profile");
const gravatar = require("gravatar");
const Group = require("../models/Group");

exports.getCurrent = expressAsync(async (req, res) => {
	const profile = await Profile.findOne({ user_id: req.user._id })
		.populate("posts")
		.populate("comments")
		.populate("groups")
		.populate("followingCount")
		.populate("followerCount");

	if (!profile) {
		return res.status(400).json({
			error: "Profile not Found. Please sign in or sign up.",
		});
	}
	return res.json(profile);
});

exports.getProfileById = expressAsync(async (req, res) => {
	const user = await User.findById(req.params.user_id);
	const profile = Profile.findOne({ user_id: user._id });
	if (!profile) {
		return res.status(400).json({ message: "Profile does not exist." });
	}

	return res.json(profile);
});

exports.getAll = expressAsync(async (req, res) => {
	const profiles = Profile.find().populate("user", ["username"]);
	return res.json(profiles);
});

exports.create = expressAsync(async (req, res) => {
	const { user_id, email } = req.user;
	const avatar = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });

	const profile = new User({ user_id, avatar });
	const savedProfile = await profile.save(err, savedProfile);
	if (!savedProfile) {
		console.log("PROFILE CREATION ERROR");
		return res.status(400).json({ error: "Profile Creation Failed." });
	} else {
		return res.json(savedProfile);
	}
});

exports.updateBio = expressAsync(async (req, res) => {
	const profile = await Profile.findOne();

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

exports.deleteProfile = expressAsync(async (req, res) => {
	const profile = await Profile.findOne();

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
