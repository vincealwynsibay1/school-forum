const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
		passwordHash: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
	},
	{ timestamps: true }
);

userSchema.methods = {
	//compare the input password to the hashed password in the server
	authenticate: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.passwordHash);
	},
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("passwordHash")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

module.exports = mongoose.model("User", userSchema);
