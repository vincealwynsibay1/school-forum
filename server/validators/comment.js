const { check } = require("express-validator");

exports.createReplyValidator = () => {
	check("content").not().isEmpty().withMessage("Content is required");
};
