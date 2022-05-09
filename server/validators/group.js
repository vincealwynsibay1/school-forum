const { check } = require("express-validator");

exports.createGroupValidator = () => {
	check("name").not().isEmpty().withMessage("Name is required");
};
