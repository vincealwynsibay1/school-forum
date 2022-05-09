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
	getAllCommentsInPost,
} = require("../controllers/post");
const { isAuth } = require("../utils/utils");
const {
	createAndUpdatePostValidator,
	createCommentValidator,
} = require("../validators/post");

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
router.post("/", isAuth, createAndUpdatePostValidator, create);

// @route  PUT api/posts/:post_id
// @desc   Update post
// @access Private
router.put("/:post_id", isAuth, createAndUpdatePostValidator, update);

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

// @route  GET api/posts/:post_id/comments
// @desc   Get all comments in Post
// @access Private
router.get("/:post_id/comments", getAllCommentsInPost);

// @route  POST api/posts/:post_id/comments
// @desc   Create comment
// @access Private
router.post(
	"/:post_id/comments",
	isAuth,
	createCommentValidator,
	createComment
);

// @route  DELETE api/posts/:post_id/comments/:comment_id
// @desc   Delete comment
// @access Private
router.delete("/:post_id/comments/:comment_id", isAuth, deleteComment);

module.exports = router;
