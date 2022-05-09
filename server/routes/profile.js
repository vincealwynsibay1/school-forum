const router = require("express").Router();
const { isAuth, paginatedResults } = require("../utils/utils.js");
const {
	getAll,
	create,
	getCurrent,
	getProfileById,
	follow,
	unfollow,
} = require("../controllers/profile");

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/me", isAuth, getCurrent);

// @route    GET api/profile
// @desc     Get all users profile
// @access   Public
router.get("/", paginatedResults, getAll);

// @route    GET api/profile/:user_id
// @desc     Get current users profile
// @access   Public
router.get("/:user_id");

// @route    PUT api/profile/:user_id/follow
// @desc     Follow a user
// @access   Private
router.get("/:user_id/follow", isAuth, follow);

// @route    PUT api/profile/:user_id/unfollow
// @desc     Unfollow a user
// @access   Private
router.get("/:user_id/unfollow", isAuth, unfollow);

// @route    PUT api/profile/:user_id
// @desc     Get current users profile
// @access   Public
router.get("/:user_id");

// @route    POST api/profile/
// @desc     Create  profile
// @access   Private
router.post("/me", isAuth, create);

// @route    PUT api/profile/:user_id
// @desc     Update profile bio
// @access   Private
router.put("/:user_id", isAuth, getProfileById);

module.exports = router;
