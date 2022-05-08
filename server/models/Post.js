const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema({
	user_id: {
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
});

module.exports = mongoose.model("Post", postSchema);
