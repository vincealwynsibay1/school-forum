const { check } = require("express-validator");

exports.createAndUpdatePostValidator = () => [
	check("title").not().isEmpty().withMessage("Title is required"),
	check("content").not().isEmpty().withMessage("Content is required"),
];

exports.createCommentValidator = () => [
	check("content").not().isEmpty().withMessage("Content is required"),
];
