const Comment = require("../models/Comment");

const asyncHandler = require("express-async-handler");
const Profile = require("../models/Profile");

exports.createReply = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const comment = await Comment.findById(req.params.comment_id);
	const reply = new Comment({
		content,
		user_id: req.user._id,
		username: req.user.username,
	});
	comment.replies.unshift(reply);
	const savedReply = await reply.save();
	await Profile.updateOne(
		{ user_id: req.user._id },
		{ $push: { comments: savedReply._id } }
	);
	return res.json(savedReply);
});

exports.deleteReply = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.comment_id);
	const reply = comment.replies.find(
		(reply) => reply.id === req.params.reply_id
	);

	if (!reply) {
		return res.status(400).json({ message: "Comment does not exist." });
	}

	if (reply.user_id.toString() === req.user_id) {
		return res.status(401).json({ message: "User not authorized" });
	}

	comment.replies = comment.replies.filter(
		(reply) => reply.id !== req.params.reply_id
	);
	await comment.save();
	await Profile.updateOne(
		{ user_id: req.user._id },
		{ $pull: { comments: reply._id } }
	);
	return res.json(comment.replies);
});
