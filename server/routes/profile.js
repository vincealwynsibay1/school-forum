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
} = require("../controllers/profile");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const Profile = require("../models/Profile.js");
const upload = multer({ storage });

// @route    GET api/profile
// @desc     Get all users profile
// @access   Public
router.get("/", paginatedResults(Profile), getAll);

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

// @route    POST api/profile/
// @desc     Create  profile
// @access   Private
router.post("/me", isAuth, create);

// @route    PUT api/profile/:user_id/bio
// @desc     Update profile bio
// @access   Private
router.put("/:user_id/bio", isAuth, updateBio);

// @route    PUT api/profile/:user_id/avatar
// @desc     Update profile avatar
// @access   Private
router.put("/:user_id/avatar", isAuth, upload.single("avatar"), updateAvatar);

module.exports = router;
