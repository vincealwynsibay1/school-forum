const router = require("express").Router();
const { isAuth, paginatedResults } = require("../utils/utils.js");
const {
	getAll,
	create,
	getCurrent,
	getProfileById,
	follow,
	unfollow,
	updateAvatar,
	updateBio,
	update,
} = require("../controllers/profile");
const Profile = require("../models/Profile.js");

// @route    GET api/profile
// @desc     Get all users profile
// @access   Public
router.get("/", getAll);

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/me", isAuth, getCurrent);

// @route    GET api/profile/:user_id
// @desc     Get a user's profile by id
// @access   Public
router.get("/:user_id", getProfileById);

// @route    PUT api/profile/:user_id/follow
// @desc     Follow a user
// @access   Private
router.put("/:user_id/follow", isAuth, follow);

// @route    PUT api/profile/:user_id/unfollow
// @desc     Unfollow a user
// @access   Private
router.put("/:user_id/unfollow", isAuth, unfollow);

// @route    PUT api/profile/:user_id
// @desc     Update profile
// @access   Private
router.put("/:user_id", isAuth, update);

module.exports = router;
