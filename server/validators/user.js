const { check } = require("express-validator");

exports.userUpdateValidator = () => [
	check("username").not().isEmpty().withMessage("Username is required"),
	check("password")
		.isLength({ min: 7 })
		.isEmpty()
		.withMessage("Password must be at least 7 characters long"),
];
