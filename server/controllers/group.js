const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");
const gravatar = require("gravatar");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { paginatedResultsByArr } = require("../utils/utils");

exports.getAll = asyncHandler(async (req, res) => {
	return res.json(res.paginatedResults);
});
exports.getById = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id)
		.populate("members")
		.populate("posts")
		.populate("moderators");

	let page = 1;
	let limit = 2;

	if (req.query.page) {
		page = parseInt(req.query.page);
	}
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	const paginatedPosts = paginatedResultsByArr(group.posts, page, limit);
	return res.json({
		posts: paginatedPosts,
		members: group.members,
		moderators: group.moderators,
		rules: group.rules,
		description: group.description,
		created_at: group.created_at,
		groupPhoto: group.groupPhoto,
		name: group.name,
	});
});

exports.getByName = asyncHandler(async (req, res) => {
	const group = await Group.findOne({ name: req.body.name })
		.populate("members")
		.populate("moderators")
		.populate("posts");
	return res.json(group);
});

exports.create = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const photoUrl = gravatar.url(`${name}@group`, {
		s: "200",
		r: "pg",
		d: "retro",
	});

	const post = new Post({
		title: "Congratulations!",
		content: "Welcome to your newly create community",
		user_id: req.user._id,
	});
	const savedPost = await post.save();
	const group = new Group({
		name,
		members: [req.user._id],
		moderators: [req.user._id],
		groupPhoto: { url: photoUrl, fileName: "retro" },
		admin: req.user._id,
		posts: [savedPost._id],
	});

	const profile = await Profile.findOne({ user_id: req.user._id });

	profile.groups.unshift(group._id);

	await profile.save();

	const savedGroup = await group.save();
	return res.json(savedGroup);
});

exports.update = asyncHandler(async (req, res) => {
	const { name, description, rules } = req.body;
	const updatedGroupFields = {
		name,
		description,
		rules: Array.isArray(rules)
			? rules
			: rules.split("\n").map((rule) => " " + rule.trim()),
	};

	let group = await Group.findById(req.params.group_id);

	if (!group) {
		return res.status(400).json({ error: "Group does not exist." });
	}

	if (!group.moderators.includes(req.user._id)) {
		return res
			.status(400)
			.json({ message: "User is not a moderator of this group" });
	}
	group.name = updatedGroupFields.name;
	group.description = updatedGroupFields.description;
	group.rules = updatedGroupFields.rules;
	const updatedGroup = await group.save();
	return res.json(updatedGroup);
});

exports.updatePhoto = asyncHandler(async (req, res) => {
	const group = await Group.findOne({ user_id: req.user._id });
	if (!group) {
		return res.status(400).json({ error: "Group does not exist" });
	}
	if (!group.moderators.includes(req.user._id)) {
		return res
			.status(400)
			.json({ error: "User is not a moderator of this group" });
	}
	const updatedProfile = await Group.updateOne(
		{ id: req.params.group_id },
		{
			$set: {
				avatar: { url: req.file.path, fileName: req.file.fileName },
			},
		}
	);
	return res.json(updatedProfile);
});

exports.deleteGroup = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id);
	if (!group) {
		return res.status(400).json({ error: "Group does not exist" });
	}
	if (!group.moderators.includes(req.user._id)) {
		return res.json({
			error: "User is not a moderator of this group. Not enough authorization.",
		});
	}
	await Group.deleteOne({ id: req.params.group_id });
	return res.json({ message: "Group Successfully Deleted." });
});

exports.join = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id);
	if (group.members.some((member) => member.toString() === req.user._id)) {
		return res.status(400).json({ message: "User already a member" });
	}
	group.members.unshift(req.user._id);
	const profile = await Profile.findOne({ user_id: req.user._id });
	if (!profile) {
		return res
			.status(404)
			.json({ error: "Profile does not exist. Please Login" });
	}
	profile.groups.unshift(group);
	await profile.save();
	const updatedGroup = await group.save();
	return res.json(updatedGroup);
});

exports.leave = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id);
	console.log(group);
	if (!group.members.some((member) => member.toString() === req.user._id)) {
		return res.status(400).json({ message: "User is not a member" });
	}

	const profile = await Profile.findOne({ user_id: req.user._id });
	if (!profile) {
		return res
			.status(404)
			.json({ error: "Profile does not exist. Please Login" });
	}
	group.members = group.members.filter(
		(member) => member.toString() !== req.user._id
	);

	profile.groups = profile.groups.filter(
		(g) => g.toString() !== group._id.toString()
	);

	await profile.save();
	const updatedGroup = await group.save();
	return res.json(updatedGroup);
});

exports.updateModerators = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id);
	if (!group) {
		return res.status(400).json({ error: "Group does not exist." });
	}
	if (
		group.moderators.some((mod) => mod.toString() === req.body.new_user_id)
	) {
		return res
			.status(400)
			.json({ error: "User is already a moderator of this group" });
	}
	if (group.moderators.some((mod) => mod.toString() === req.user._id)) {
		group.moderators.push(req.body.new_user_id);
		group.members.push(req.body.new_user_id);
	}
	const updatedGroup = await group.save();
	return res.json(updatedGroup);
});
