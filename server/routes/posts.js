const {
	getAll,
	getById,
	create,
	update,
	deletePost,
	upvote,
	downvote,
	deleteComment,
	createComment,
} = require("../controllers/post");

const router = require("express").Router({ mergeParams: true });

// @route  GET api/posts/
// @desc   Get all posts
// @access Public
router.get("/", getAll);

// @route  GET api/posts/:post_id
// @desc   Get post by id
// @access Public
router.get("/:post_id", getById);

// @route  POST api/posts/
// @desc   Create new post
// @access Private
router.post("/", isAuth, create);

// @route  PUT api/posts/:post_id
// @desc   Update post
// @access Private
router.put("/:post_id", isAuth, update);

// @route  DELETE api/posts/:post_id
// @desc   Delete post
// @access Private
router.delete("/:post_id", isAuth, deletePost);

// @route  PUT api/posts/upvote/:post_id
// @desc   Upvote post
// @access Private
router.put("/upvote/:post_id", isAuth, upvote);

// @route  PUT api/posts/downvote/:post_id
// @desc   Downvote post
// @access Private
router.put("/downvote/:post_id", isAuth, downvote);

// @route  POST api/posts/:post_id/comments
// @desc   Create reply comment
// @access Private
router.post("/:post_id/comments", isAuth, createComment);

// @route  DELETE api/posts/:post_id/comments/:comment_id
// @desc   Delete comment
// @access Private
router.delete("/:post_id/comments/:comment_id", isAuth, deleteComment);

module.exports = router;
