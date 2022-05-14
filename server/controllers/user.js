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
		return res.status(400).json({ error: "User not found" });
	}

	if (
		!user.username === req.user.username ||
		!user.email === req.user.email
	) {
		return res.status(400).json({ error: "Authentication Error" });
	}

	const userByUsername = await User.findOne({ username });

	if (userByUsername) {
		return res.status(400).json({ error: "Username already taken" });
	}

	const profile = await Profile.findOne({ user_id: user._id });

	profile.username = username;
	user.username = username;
	user.passwordHash = password;

	await profile.save();
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

	const groupsUserIsMod = await Group.find({
		moderators: req.user._id,
	});

	if (groupsUserIsMod && groupsUserIsMod.length > 0) {
		for (let i = 0; i < groupsUserIsMod.length; i++) {
			if (
				groupsUserIsMod[i].moderators &&
				groupsUserIsMod[i].moderators.length === 1
			) {
				await Group.deleteOne({ _id: groupsUserIsMod[i]._id });
			}

			const group = await Group.findById(groupsUserIsMod[i]._id);

			group.moderators = group.moderators.filter(
				(mod) => mod.toString() !== user._id.toString()
			);

			await group.save();
		}
	}

	const groupsUserIsMember = await Group.find({ members: req.user._id });

	if (groupsUserIsMember && groupsUserIsMember.length > 0) {
		for (let i = 0; i < groupsUserIsMember.length; i++) {
			const group = await Group.findById(groupsUserIsMember[i]._id);
			group.members = group.members.filter(
				(mem) => mem.toString() !== user.id.toString()
			);

			await group.save();
		}
	}

	await Comment.deleteMany({ user_id: req.user._id });
	await Post.deleteMany({ user_id: req.user._id });
	await Group.deleteMany({ admin: req.user._id });
	await Profile.findOneAndDelete({ user_id: user._id });
	await User.deleteOne({ _id: req.params.user_id });

	return res.json({ message: "User Successfully Deleted" });
});
