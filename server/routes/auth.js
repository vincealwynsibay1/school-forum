const router = require("express").Router();

const { signup, signin } = require("../controllers/auth");

const {
	userSignupValidator,
	userSigninValidator,
} = require("../validators/auth");

// @route    POST api/auth/signin
// @desc     Login user
// @access   Public
router.post("/signin", userSigninValidator, signin);

// @route    POST api/auth/signup
// @desc     Register new user
// @access   Public
router.post("/signup", userSignypValidator, signup);

module.exports = router;
