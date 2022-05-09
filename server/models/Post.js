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

postSchema.pre("remove", async function () {
	const post = this;

	// remove post in posts array of Profile
	post.model("Profile").update(
		{ posts: post._id },
		{ $pull: { posts: post._id } }
	);

	// delete post in groups array of posts
	post.model("Group").update(
		{ posts: post._id },
		{ $pull: { posts: post._id } }
	);

	// delete all comments in the post
	if (post.comments && post.comments.length > 0) {
		for (let i = 0; i < post.comments.length; i++) {
			await Comment.deleteOne({ _id: comment._id });
		}
	}
});

module.exports = mongoose.model("Post", postSchema);
