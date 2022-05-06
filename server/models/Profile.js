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
		},
	],
	groups: [
		{
			type: ObjectId,
		},
	],
	comments: [
		{
			type: ObjectId,
		},
	],
	followerCount: [
		{
			type: ObjectId,
		},
	],
	followingCount: [
		{
			type: ObjectId,
		},
	],
});

module.exports = mongoose.model("Profile", profileSchema);
