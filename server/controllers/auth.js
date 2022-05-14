const User = require("../models/User");
const Profile = require("../models/Profile");
const { generateToken } = require("../utils/utils");
const asyncHandler = require("express-async-handler");
const gravatar = require("gravatar");

exports.signin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
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
	const token = generateToken({
		_id: user._id,
		email,
		username: user.username,
		role: user.role,
	});

	// return response to client
	return res.json({
		token,
		user: {
			email: user.email,
			role: user.role,
			username: user.username,
			_id: user._id,
		},
	});
});

exports.signup = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	const userByEmail = await User.findOne({ email });
	const userByUsername = await User.findOne({ username });
	if (userByEmail) {
		return res.status(400).json({ error: "Email already taken." });
	} else if (userByUsername) {
		return res.status(400).json({ error: "Username already taken." });
	}

	const newUser = new User({ username, email, passwordHash: password });

	const savedUser = await newUser.save();

	const avatarUrl = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "identicon",
	});

	const profile = new Profile({
		user_id: savedUser._id,
		avatar: { url: avatarUrl, fileName: "identicon" },
		username,
	});

	await profile.save();
	return res.json({ _id: savedUser._id, email, username });
});
