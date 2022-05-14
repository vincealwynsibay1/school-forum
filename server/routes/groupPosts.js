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
	getAllPostInGroup,
} = require("../controllers/post");
const { isAuth, paginatedResults } = require("../utils/utils");
const {
	createAndUpdatePostValidator,
	createCommentValidator,
} = require("../validators/post");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const router = require("express").Router({ mergeParams: true });

// @route  GET api/groups/:group:id/posts/
// @desc   Get all posts In Group
// @access Public
router.get("/", getAllPostInGroup);

// @route  GET api/groups/:group:id/posts/:post_id
// @desc   Get post by id
// @access Public
router.get("/:post_id", getById);

// @route  POST api/groups/:group:id/posts/
// @desc   Create new post
// @access Private
router.post("/", isAuth, upload.array("images"), create);

// @route  PUT api/groups/:group:id/posts/:post_id
// @desc   Update post
// @access Private
router.put("/:post_id", isAuth, update);

// @route  DELETE api/groups/:group:id/posts/:post_id
// @desc   Delete post
// @access Private
router.delete("/:post_id", isAuth, deletePost);

// @route  PUT api/groups/:group:id/posts/upvote/:post_id
// @desc   Upvote post
// @access Private
router.put("/upvote/:post_id", isAuth, upvote);

// @route  PUT api/groups/:group:id/posts/downvote/:post_id
// @desc   Downvote post
// @access Private
router.put("/downvote/:post_id", isAuth, downvote);

// @route  GET api/groups/:group:id/posts/:post_id/comments
// @desc   Get all comments in Post
// @access Private
router.get("/:post_id/comments", getAllCommentsInPost);

// @route  POST api/groups/:group:id/posts/:post_id/comments
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
