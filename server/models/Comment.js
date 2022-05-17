const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
	author: {
		type: ObjectId,
	},
	content: {
		type: String,
		required: true,
	},
	upvotes: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	downvotes: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	replies: [
		{
			user_id: {
				type: ObjectId,
			},
			content: {
				type: String,
				required: true,
			},
			upvotes: [
				{
					type: ObjectId,
					ref: "User",
				},
			],
			downvotes: [
				{
					type: ObjectId,
					ref: "User",
				},
			],
		},
	],
	date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
