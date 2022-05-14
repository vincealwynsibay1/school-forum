const mongoose = require("mongoose");
const Comment = require("./Comment");
const ImageSchema = require("./ImageSchema");
const Post = require("./Post");
const { ObjectId } = mongoose.Schema;
const profileSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
	},
	username: { type: String, required: true },
	avatar: ImageSchema,
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
	followers: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	following: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	created_at: { type: Date, required: true, default: Date.now },
});

// remove the relationships of the to be delete profile on groups the user joined, and delete all posts and comments
profileSchema.pre("remove", async (next) => {
	const profile = this;

	if (profile.groups && profile.groups.length > 0) {
		profile.groups.forEach((group) => {
			profile
				.model("Group")
				.update(
					{ _id: group._id },
					{ $pullAll: { moderators: [profile.user_id] } }
				);

			profile
				.model("Group")
				.update(
					{ _id: group },
					{ $pullAll: { members: [profile.user_id] } }
				);
		});
	}

	// remove the profile on the follower's profile's following array
	if (profile.followers && profile.followers.length > 0) {
		profile.followers.forEach((follower) => {
			profile
				.model("Profile")
				.update(
					{ _id: follower },
					{ $pull: { following: profile.user_id } }
				);
		});
	}

	// remove the profile on the followed profile's followers array
	if (profile.following && profile.followers.length > 0) {
		profile.following.forEach((followed) => {
			profile
				.model("Profile")
				.update(
					{ _id: followed },
					{ $pull: { followers: req.user._id } }
				);
		});
	}
});

module.exports = mongoose.model("Profile", profileSchema);
