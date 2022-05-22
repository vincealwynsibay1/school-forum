const router = require("express").Router();

const { register, login, getUserByToken } = require("../controllers/auth");
const { isAuth } = require("../utils/utils");

const {
	userSignupValidator,
	userSigninValidator,
} = require("../validators/auth");

router.get("/", isAuth, getUserByToken);

// @route    POST api/auth/register
// @desc     Register new user
// @access   Public
router.post("/register", userSignupValidator, register);

// @route    POST api/auth/login
// @desc     Login user
// @access   Private
router.post("/login", userSigninValidator, login);

module.exports = router;
