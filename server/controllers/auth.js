const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/utils");

exports.signup = (req, res) => {
	const { username, email, password } = req.body;
	const user = new User({ username, email, passwordHash: password });
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({ error: err.message });
		}
		const { _id, email, username, role } = user;
		return res.json({ user: { _id, email, username, role } });
	});
};

exports.signin = (req, res) => {
	const { email, password } = req.body;
	console.log(email);
	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist. Please register.",
			});
		}

		if (!user.authenticate(password)) {
			return res
				.status(401)
				.json({ error: "Email or Password does not match" });
		}

		// generate token
		const { _id, email, username, role } = user;
		const token = generateToken({ _id, email, username, role });
		// return response to client
		return res.json({ token, user: { _id, email, username, role } });
	});
};

exports.signout = (req, res) => {};
