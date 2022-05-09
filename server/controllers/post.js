const Post = require("../models/Post");
const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");

exports.getAll = asyncHandler(async (req, res) => {
	const { title, sort } = req.query;
	let posts = null;
	if (title) {
		posts = await Post.find({ title: `/.*${title}.*/i` })
			.populate("user_id", ["_id", "username"])
			.populate("group", "name");
	} else {
		posts = await Post.find({})
			.populate("user_id", ["_id", "username"])
			.populate("group", "name");
	}

	if (sort) {
		if (sort === "newest") {
			posts.sort({ created_at: -1 });
		} else if (sort === "popular") {
			posts.sort({ upvotes: -1 });
		}
	}

	return res.json(posts);
});

exports.getById = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id)
		.populate("user_id", ["_id", "username"])
		.populate("upvotes", ["_id", "username"])
		.populate("downvotes", ["_id", "username"])
		.populate("group", ["_id", "name"]);
	return res.json(post);
});

exports.create = asyncHandler(async (req, res) => {
	const { title, content } = req.body;
	const group = await Group.findById(req.params.group_id).populate("members");
	if (!group.members.some((member) => member.toString === req.user._id)) {
		return res
			.status(400)
			.json({ message: "User is not a member of this group. " });
	}
	const post = new Post({
		title,
		content,
		user_id: req.user._id,
		group: group._id,
	});
	const savedPost = await post.save();
	await Group.updateOne(
		{ _id: req.params.group_id },
		{ $push: { members: savedPost._id } }
	);
	return res.json(savedPost);
});

exports.update = asyncHandler(async (req, res) => {
	const { title, content } = req.body;
	const group = await Group.findById(req.params.group_id).populate("members");
	const post = await Post.findById(req.params.post_id);
	if (
		req.user === post.user_id &&
		group.members.some((member) => member.toString() === req.user._id)
	) {
		await Post.updateOne(
			{ id: req.params.post_id },
			{
				$set: { title, content, edited: true },
			}
		);
	}
	return res.json(post);
});

exports.deletePost = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id).populate("members");
	const post = await Post.findById(req.params.post_id);

	if (
		req.user === post.user_id.toString() &&
		group.members.some((member) => member.toString() === req.user._id)
	) {
		Post.deleteOne({ id: req.params.post_id });
	}

	return res.json({ message: "Post successfully deleted." });
});

exports.upvote = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);

	if (post.upvotes.some((upvote) => upvote.toString() === req.user._id)) {
		return res.status(400).json({ message: "Post already upvoted" });
	}
	post.upvotes.unshift(req.user._id);
	const savedPost = await post.save();
	return res.json(savedPost);
});

exports.downvote = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);

	if (!post.upvotes.some((upvote) => upvote.toString() === req.user._id)) {
		return res
			.status(400)
			.json({ message: "Post has not yet been upvoted" });
	}
	post.upvotes = post.upvotes.filter(
		(upvote) => upvote.toString() !== req.user._id
	);
	post.upvotes.unshift(req.user._id);
	const savedPost = await post.save();
	return res.json(savedPost);
});

exports.getAllCommentsInPost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);
	const comments = post.comments.sort((a, b) => {
		if (a.upvotes < b.upvotes) {
			return -1;
		}
		if (a.upvotes > b.upvotes) {
			return 1;
		}
		return 0;
	});

	return res.json(comments);
});

exports.createComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);
	const { content } = req.body;
	const comment = new Comment({
		content,
		user_id: req.user._id,
		username: req.user.username,
	});
	const savedComment = await comment.save();
	post.comments.unshift(savedComment._id);
	return res.json(savedComment);
});

exports.deleteComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);
	const comment = post.comments.find(
		(comment) => comment.id === req.params.comment_id
	);

	if (!comment) {
		return res.status(400).json({ message: "Comment does not exist." });
	}

	if (comment.user_id.toString() === req.user_id) {
		return res.status(401).json({ message: "User not authorized" });
	}

	post.comments = post.comments.filter(
		(comment) => comment.id !== req.params.comment_id
	);
	await post.save();
	return res.json(post.comments);
});
