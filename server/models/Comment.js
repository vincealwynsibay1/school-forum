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
	created_at: { type: Date, required: true, default: Date.now },
});

commentSchema.pre("remove", async (next) => {
	const comment = this;

	// remove the comment on the profile's comment array
	comment
		.model("Profile")
		.update({ comments: comment._id }, { $pull: { comments: comment_id } });

	// remove the comment on the post
	comment
		.model("Post")
		.update({ comments: comment._id }, { $pull: { comments: comment_id } });
});

module.exports = mongoose.model("Comment", commentSchema);
