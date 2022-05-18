const User = require("../models/User");
const Profile = require("../models/Profile");
const asyncHandler = require("express-async-handler");
const Group = require("../models/Group");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getAll = asyncHandler(async (req, res) => {
	// fetches all user
	const users = await User.find({});
	return res.json(users);
});

exports.update = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	// finds user based on the user_id on params
	const user = await User.findById(req.params.user_id);

	// checks if the user exists
	if (!user) {
		return res.status(401).json({ error: "User not found" });
	}

	// checks if the current logged in user's email and the user he/she is trying to edit is the same
	if (!user.email === req.user.email) {
		return res.status(400).json({ error: "Authentication failed" });
	}

	user.username = username;
	user.password = password;
	const updatedUser = await user.save();
	return res.json(updatedUser);
});

exports.updateAvatar = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });

	// checks if the user exists
	if (!user) {
		return res.status(400).json({ error: "User does not exist" });
	}

	// checks if user is authorized to updated
	if (user._id !== req.user._id) {
		return res.status(401).json({ error: "Cannot update user" });
	}

	// checks if the avatar file exists
	if (req.file) {
		return res.status.json({ error: "Missing files." });
	}

	// updates user
	user.avatar = { url: req.file.path, fileName: req.file.fileName };

	const updatedUser = await user.save();
	return res.json(updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });

	// checks if the user exists
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	// checks if the logged in user is authorized
	if (user._id.toString() !== req.user._id) {
		return res.status(400).json({ error: "Authentication failed" });
	}

	// updates the groups where user is a moderator of
	await Group.updateMany(
		{
			moderators: req.user._id,
		},
		{ $pull: { moderators: req.user._id } }
	);

	// updates the groups where user is a member of
	await Group.updateMany(
		{
			members: req.user._id,
		},
		{
			$pull: { members: req.user._id },
		}
	);

	// deletes the user
	await User.deleteOne({ _id: user._id });

	// deletes the profile
	await Profile.findOneAndDelete({ user: user._id });

	// deletes the group where user is the admin
	await Group.deleteMany({ admin: user._id });

	// deletes all of the user's comments
	await Comment.deleteMany({ author: user._id });

	// deletes all the user's post
	await Post.deleteMany({ author: user._id });

	// updates the profiles of the user's followed users
	await Profile.updateMany(
		{ followers: req.user._id },
		{ $pull: { followers: req.user._id } }
	); // remove the user in the current user's following

	return res.json({ message: "User successfully deleted" });
});
