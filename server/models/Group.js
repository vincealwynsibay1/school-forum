const mongoose = require("mongoose");
const ImageSchema = require("./ImageSchema");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	groupPhoto: ImageSchema,
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
	rules: [
		{
			type: String,
		},
	],
	admin: {
		type: ObjectId,
		ref: "User",
	},
	date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
