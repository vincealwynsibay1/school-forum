const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	members: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	moderators: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	posts: [
		{
			type: ObjectId,
			ref: "Post",
		},
	],
	rules: [
		{
			type: String,
		},
	],
});

groupSchema.pre("remove", async (next) => {
	const group = this;

	group
		.model("Profile")
		.update({ groups: group._id }, { $pull: { groups: group._id } });

	await Post.deleteMany({ group: group._id });
});

module.exports = mongoose.model("Group", groupSchema);
