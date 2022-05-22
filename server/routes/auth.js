const router = require("express").Router();

const { register, login, getUserByToken } = require("../controllers/auth");
const { isAuth } = require("../utils/utils");

const {
	userSignupValidator,
	userSigninValidator,
} = require("../validators/auth");

router.get("/", isAuth, getUserByToken);

// @route    POST api/auth/signup
// @desc     Register new user
// @access   Public
router.post("/register", userSignupValidator, register);

// @route    POST api/auth/signin
// @desc     Login user
// @access   Private
router.post("/signin", userSigninValidator, login);

module.exports = router;
