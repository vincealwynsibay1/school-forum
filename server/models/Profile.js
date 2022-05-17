const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const profileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
	},
	bio: {
		type: String,
	},
	followers: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	following: [
		{
			type: ObjectId,
			ref: "User",
		},
	],

	date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Profile", profileSchema);
