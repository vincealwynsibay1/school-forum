const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");

exports.getAll = asyncHandler(async (req, res) => {
	return res.json(res.paginatedResults);
});

exports.getById = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id)
		.populate("members")
		.populate("moderators")
		.populate("posts");
	return res.json(group);
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
	const photoUrl = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "retro",
	});
	const group = new Group({
		name,
		moderators: [req.user._id],
		groupPhoto: { url: photoUrl, fileName: "retro" },
	});

	await group.save();
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

	const group = Group.findById(req.params.group_id);

	if (group.moderators.includes(req.user._id)) {
		await Group.updateOne(
			{ id: req.params.group_id },
			{
				$set: updatedGroupFields,
			}
		);
	}
	return res.json(updatedGroup);
});

exports.updatePhoto = asyncHandler(async (req, res) => {
	const group = await Group.findOne({ user_id: req.user._id });

	if (group.moderators.includes(req.user._id)) {
		const updatedProfile = await Group.updateOne(
			{ id: req.params.group_id },
			{
				$set: {
					avatar: { url: req.file.path, fileName: req.file.fileName },
				},
			}
		);
	}

	return res.json(updatedProfile);
});

exports.deleteGroup = asyncHandler(async (req, res) => {
	await Group.findById(req.params.group_id);
	if (group.moderators.includes(req.user._id)) {
		await Group.deleteOne({ id: req.params.group_id });
	}
	return res.json({ message: "Group Successfully Deleted." });
});

exports.join = asyncHandler(async (req, res) => {
	const group = await Group.findByIdAndUpdate(req.params.group_id, {
		$push: { members: req.user._id },
	});
	return res.json(group);
});

exports.leave = asyncHandler(async (req, res) => {
	const group = await Group.findByIdAndUpdate(req.params.group_id, {
		$set: {
			members: this.members.filter((member) => member !== req.user._id),
		},
	});
	return res.json(group);
});

exports.updateModerators = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id);
	if (group.moderators.includes(req.user._id)) {
		await Group.updateOne(
			{ id: req.params.group_id },
			{ $push: { moderators: req.body.user } }
		);
	}
	return res.json(group);
});
