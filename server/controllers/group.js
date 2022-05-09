const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");

exports.getAll = asyncHandler(async (req, res) => {
	const { name, sort } = req.query;

	const groups = null;

	if (name) {
		groups = await Group.find({ name: `/.*${name}.*/i` });
	} else {
		groups = await Group.find({});
	}

	if (sort) {
		if (sort === "top") {
			groups = groups.sort({ members: -1 });
		}
	}

	return res.json(groups);
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
	const group = new Group({ name, moderators: [req.user._id] });

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
