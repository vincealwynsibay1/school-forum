const User = require("../models/User");
const Profile = require("../models/Profile");
const asyncHandler = require("express-async-handler");
const Group = require("../models/Group");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getAll = asyncHandler(async (req, res) => {
	const users = await User.find({});
	return res.json(users);
});

exports.update = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findById(req.params.user_id);

	if (!user) {
		return res.status(401).json({ error: "User not found" });
	}

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

	if (!user) {
		return res.status(400).json({ error: "User does not exist" });
	}

	if (user._id !== req.user._id) {
		return res.status(401).json({ error: "Cannot update user" });
	}

	if (req.file) {
		return res.status.json({ error: "Missing files." });
	}

	user.avatar = { url: req.file.path, fileName: req.file.fileName };

	const updatedUser = await user.save();
	return res.json(updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (user._id.toString() !== req.user._id) {
		return res.status(400).json({ error: "Authentication failed" });
	}

	await Group.updateMany(
		{
			moderators: req.user._id,
		},
		{ $pull: { moderators: req.user._id } }
	);

	await Group.updateMany(
		{
			members: req.user._id,
		},
		{
			$pull: { members: req.user._id },
		}
	);

	await User.deleteOne({ _id: user._id });
	await Profile.findOneAndDelete({ user: user._id });
	await Group.deleteMany({ admin: user._id });
	await Comment.deleteMany({ author: user._id });
	await Post.deleteMany({ author: user._id });
	return res.json({ message: "User successfully deleted" });
});
