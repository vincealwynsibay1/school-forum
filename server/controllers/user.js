const User = require("../models/User");
const Profile = require("../models/Profile");

exports.update = expressAsync(async (req, res) => {
	const { username, password } = req.body;

	const user = User.findOneById(req.params.user_id);

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (
		!user.username === req.user.username ||
		!user.email === req.user.email
	) {
		return res.status(400).json({ error: "Authentication Error" });
	}

	user.username = username;
	user.password = password;

	const updatedUser = await user.save();

	if (!updatedUser) {
		console.log("USER UPDATE ERROR", err);
		return res.status(400).json({ error: "User update failed" });
	} else {
		return res.json(updatedUser);
	}
});

exports.deleteUser = expressAsync(async (req, res) => {
	const user = await User.findById(req.params.user_id);
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (
		!user.username === req.user.username ||
		!user.email === req.user.email
	) {
		return res.status(400).json({ error: "Authentication Error" });
	}

	const deletedUser = User.deleteOne({ _id: req.params.user_id });
	if (!deletedUser) {
		return res.json(400).json({ error: "User delete failed" });
	} else {
		Profile.updateOne(
			{ _id: req.params.user_id },
			{ $pull: { user_id: user._id } }
		);
		return res.json(deletedUser);
	}
});
