const User = require("../models/User");
const Profile = require("../models/Profile");
const { generateToken } = require("../utils/utils");
const asyncHandler = require("express-async-handler");
const gravatar = require("gravatar");

exports.getUserByToken = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id).select("-password");
	return res.json(user);
});

exports.login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	// checks if user exists
	if (!user) {
		return res.status(400).json({
			error: "User with that email does not exist. Please register.",
		});
	}

	// checks if the inputted password matches to the user's password on database
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
	});
});

exports.register = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	console.log(username, email, password);

	const user = await User.findOne({ email });

	// checks if a user with that email already exists
	if (user) {
		return res.status(400).json({ error: "Email already taken." });
	}

	// create default avatar
	const avatarUrl = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "identicon",
	});

	// creates new user with default avatar
	const newUser = new User({
		username,
		email,
		password,
		avatar: { url: avatarUrl, fileName: `${username}.identicon` },
	});

	// save user
	const savedUser = await newUser.save();

	// generate token
	const token = generateToken({
		_id: savedUser._id,
		email,
		username,
	});

	// after saving the new user, a profile will be created
	const profile = new Profile({
		user: savedUser._id,
	});

	await profile.save();
	return res.json({ token });
});
