const User = require("../models/User");

exports.read = (req, res) => {
	return res.json(req.user);
};

exports.update = (req, res) => {
	const { username, password } = req.body;

	User.findOne({ _id: req.user._id }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({ error: "User not found" });
		}

		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		} else {
			user.username = username;
		}

		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		} else {
			user.password = password;
		}

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
