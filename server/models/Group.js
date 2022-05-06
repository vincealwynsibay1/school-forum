const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	members: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	moderators: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	posts: [
		{
			type: ObjectId,
			ref: "Post",
		},
	],
	rules: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model("Group", groupSchema);
