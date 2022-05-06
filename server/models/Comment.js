const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
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
	replies: [
		{
			type: ObjectId,
			ref: "Comment",
		},
	],
});

module.exports = mongoose.model("Comment", commentSchema);
