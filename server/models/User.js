const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	role: [
		{
			type: String,
			default: ["user"],
		},
	],
});

module.exports = mongoose.model("User", userSchema);
