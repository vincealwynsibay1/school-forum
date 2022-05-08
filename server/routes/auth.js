const router = require("express").Router();

const { signup, signin } = require("../controllers/auth");

const {
	userSignupValidator,
	userSigninValidator,
} = require("../validators/auth");

router.post("/signin", userSigninValidator, signin);
router.post("/signup", userSignypValidator, signup);

module.exports = router;
