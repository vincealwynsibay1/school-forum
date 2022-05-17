const mongoose = require("mongoose");
const ImageSchema = require("./ImageSchema");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	images: [ImageSchema],
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
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
	comments: [
		{
			type: ObjectId,
			ref: "Comment",
		},
	],
	edited: { type: Boolean, default: false },
	date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
