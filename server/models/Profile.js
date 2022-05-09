const mongoose = require("mongoose");
const Comment = require("./Comment");
const Post = require("./Post");
const { ObjectId } = mongoose.Schema;
const profileSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
	},
	avatar: {
		type: String,
	},
	bio: {
		type: String,
	},
	posts: [
		{
			type: ObjectId,
			ref: "Post",
		},
	],
	groups: [
		{
			type: ObjectId,
			ref: "Group",
		},
	],
	comments: [
		{
			type: ObjectId,
			ref: "Comment",
		},
	],
	followerCount: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	followingCount: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
});

// remove the relationships of the to be delete profile on groups the user joined, and delete all posts and comments
profileSchema.pre("remove", async (next) => {
	const profile = this;

	if (profile.groups && profile.groups.length > 0) {
		profile.groups.forEach((groupId) => {
			profile
				.model("Group")
				.update(
					{ _id: groupId },
					{ $pull: { members: profile.user_id } }
				);

			profile
				.model("Group")
				.update(
					{ _id: groupId },
					{ $pull: { moderators: profile.user_id } }
				);
		});
	}

	await Post.deleteMany({ user_id: profile.user_id });
	await Comment.deleteMany({ user_id: profile.user_id });
});

module.exports = mongoose.model("Profile", profileSchema);
