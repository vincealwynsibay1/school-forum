const User = require("../models/User");
const Profile = require("../models/Profile");
const asyncHandler = require("express-async-handler");

exports.getAll = asyncHandler(async (req, res) => {
	const users = await User.find({});
	return res.json(users);
});

exports.update = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	console.log("nice");

	const user = await User.findById(req.params.user_id);
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (
		!user.username === req.user.username ||
		!user.email === req.user.email
	) {
		return res.status(400).json({ error: "Authentication Error" });
	}

	user.username = username;
	user.passwordHash = password;

	const updatedUser = await user.save();

	return res.json(updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.user_id);
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (
		!user.username === req.user.username ||
		!user.email === req.user.email
	) {
		return res.status(400).json({ error: "Authentication Error" });
	}

	const deletedUser = await User.deleteOne({ _id: req.params.user_id });

	await Profile.findOneAndDelete({ user_id: user._id });

	return res.json(deletedUser);
});
