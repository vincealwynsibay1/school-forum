const Post = require("../models/Post");
const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");
const { paginatedResultsByArr } = require("../utils/utils");
const Profile = require("../models/Profile");
const Comment = require("../models/Comment");

exports.getAll = asyncHandler(async (req, res) => {
	return res.json(res.paginatedResults);
});

exports.getAllPostInGroup = asyncHandler(async (req, res) => {
	// fetches group
	const group = await Group.findOne({ _id: req.params.group_id });

	// checks if the group exists
	if (!group) {
		return res.status(400).json("Group not found");
	}

	// fetches all posts in group
	const posts = await Post.find({ group: req.params.group_id });

	let page = 1;
	let limit = 2;

	if (req.query.page) {
		page = parseInt(req.query.page);
	}
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	const paginatedResults = paginatedResultsByArr(posts, page, limit);
	return res.json(paginatedResults);
});

exports.getById = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id)
		.populate("author", ["_id", "username"])
		.populate("upvotes", ["_id", "username"])
		.populate("downvotes", ["_id", "username"])
		.populate("group", ["_id", "name"]);

	if (!post) {
		return res.status(400).json({ error: "Post does not exist" });
	}
	return res.json(post);
});

exports.create = asyncHandler(async (req, res) => {
	const { title, content } = req.body;
	const group = await Group.findById(req.params.group_id);
	if (!group.members.some((member) => member.toString() === req.user._id)) {
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

	if (req.files) {
		post.images = req.files.map((f) => ({
			url: f.url,
			fileName: f.fileName,
		}));
	}
	const savedPost = await post.save();
	return res.json(savedPost);
});

exports.update = asyncHandler(async (req, res) => {
	const { title, content } = req.body;
	const group = await Group.findById(req.params.group_id).populate("members");
	const post = await Post.findById(req.params.post_id);
	if (
		!req.user === post.user_id &&
		!group.members.some((member) => member.toString() === req.user._id)
	) {
		return res
			.status(401)
			.json({ error: "User does not have permission to edit post" });
	}

	post.title = title;
	post.content = content;
	post.edited = true;

	const updatedPost = await post.save();
	return res.json(updatedPost);
});

exports.deletePost = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.group_id).populate("members");
	const post = await Post.findById(req.params.post_id);

	if (
		!req.user === post.user_id.toString() &&
		!group.members.some((member) => member.toString() === req.user._id)
	) {
		return res
			.status(401)
			.json({ error: "User does not have permission to edit post" });
	}

	await Post.deleteOne({ id: req.params.post_id });

	return res.json({ message: "Post successfully deleted." });
});

exports.upvote = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);

	if (!post) {
		return res.status(400).json({ error: "Post does not exist" });
	}

	if (post.upvotes.some((upvote) => upvote.toString() === req.user._id)) {
		return res.status(400).json({ message: "Post already upvoted" });
	}

	post.upvotes.unshift(req.user._id);
	const savedPost = await post.save();
	return res.json(savedPost);
});

exports.downvote = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);

	if (!post) {
		return res.status(400).json({ error: "Post does not exist" });
	}

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
	const post = await Post.findById(req.params.post_id).populate("comments");
	let limit = 2;
	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	const paginatedResults = paginatedResultsByArr(post.comments, page, limit);
	return res.json(paginatedResults);
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
	await post.save();
	return res.json(savedComment);
});

exports.deleteComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.post_id);

	const comment = await Comment.findOne({ _id: req.params.comment_id });

	if (!comment) {
		return res.status(400).json({ message: "Comment does not exist." });
	}

	if (comment.user_id.toString() === req.user_id) {
		return res.status(401).json({ message: "User not authorized" });
	}

	await Comment.deleteOne({ _id: comment._id });

	post.comments = post.comments.filter(
		(comment) => comment !== req.params.comment_id
	);
	await post.save();
	return res.json(post.comments);
});
