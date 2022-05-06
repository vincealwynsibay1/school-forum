const mongoose = require("mongoose");
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
	upvotes: [
		{
			type: ObjectId,
		},
	],
	downvotes: [
		{
			type: ObjectId,
		},
	],
	comments: [
		{
			type: ObjectId,
		},
	],
});

module.exports = mongoose.model("Post", postSchema);
