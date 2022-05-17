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

	const user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({ error: "Email already taken." });
	}

	const avatarUrl = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "identicon",
	});

	const newUser = new User({
		username,
		email,
		password,
		avatar: { url: avatarUrl, fileName: `${username}.identicon` },
	});

	const savedUser = await newUser.save();

	const profile = new Profile({
		user: savedUser._id,
	});

	await profile.save();
	return res.json({ _id: savedUser._id, email, username });
});
