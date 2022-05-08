const User = require("../models/User");

exports.update = (req, res) => {
	const { username, password } = req.body;

	User.findOne({ _id: req.params.user_id }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.username = username;
		user.password = password;

		user.save((err, updatedUser) => {
			if (err) {
				console.log("USER UPDATE ERROR", err);
				return res.status(400).json({ error: "User update failed" });
			} else {
				res.json(updatedUser);
			}
		});
	});
};

exports.deleteProfile = (req, res) => {
	User.findByIdAndDelete(req.user._id, (err, deletedUser) => {
		if (err) {
			return res.json(400).json({ error: "User delete failed" });
		}
		return res.json(deletedUser);
	});
};
