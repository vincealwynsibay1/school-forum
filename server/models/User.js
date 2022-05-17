const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ImageSchema = require("./ImageSchema");
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: ImageSchema,
		role: {
			type: String,
			default: "user",
		},
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

userSchema.methods = {
	//compare the input password to the hashed password in the server
	authenticate: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	},
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
