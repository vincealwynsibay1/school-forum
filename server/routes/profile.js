const router = require("express").Router();
const { isAuth } = require("../utils/utils.js");
const {
	getAll,
	create,
	getCurrent,
	getProfileById,
} = require("../controllers/profile");

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/me", isAuth, getCurrent);

// @route    GET api/profile
// @desc     Get all users profile
// @access   Public
router.get("/", getAll);

// @route    GET api/profile/:user_id
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
