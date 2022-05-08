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

profileSchema.pre("remove", async function (next) {
	this.model("Group").update(
		{ members: { $in: groups.members } },
		{ $pull: { member: profile.user_id } },
		{ multi: true },
		next
	);
});

module.exports = mongoose.model("Profile", profileSchema);
