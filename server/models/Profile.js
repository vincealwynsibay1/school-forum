const mongoose = require("mongoose");
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

module.exports = mongoose.model("Profile", profileSchema);
