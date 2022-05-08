const User = require("../models/User");
const Profile = require("../models/Profile");
const gravatar = require("gravatar");

exports.getCurrent = (req, res) => {
	Profile.findOne({ user_id: req.user._id })
		.populate("posts")
		.populate("comments")
		.populate("groups")
		.populate("followingCount")
		.populate("followerCount")
		.exec((err, profile) => {
			if (err || !profile) {
				return res.status(400).json({
					error: "Profile not Found. Please sign in or sign up.",
				});
			}

			return res.json(profile);
		});
};

exports.getProfileById = (req, res) => {
	User.findById(req.params.user_id, (err, user) => {
		Profile.findOne({ user_id: user._id }, (err, profile) => {
			if (err || !profile)
				return res
					.status(400)
					.json({ message: "Profile does not exist." });
			else return res.json(profile);
		});
	});
};

exports.getAll = (req, res) => {
	Profile.find()
		.populate("user", ["username"])
		.exec((err, profiles) => {
			return res.json(profiles);
		});
};

exports.create = (req, res) => {
	const { user_id, email } = req.user;
	const avatar = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });

	const profile = new User({ user_id, avatar });
	profile.save((err, savedProfile) => {
		if (err || !savedProfile) {
			console.log("PROFILE CREATION ERROR");
			return res.status(400).json({ error: "Profile Creation Failed." });
		} else {
			return res.json(savedProfile);
		}
	});
};

exports.updateBio = (req, res) => {
	Profile.findOneAndUpdate(
		{ user_id: req.user._id },
		{ $set: { bio: req.body.bio } },
		(err, updatedProfile) => {
			if (err) {
				console.log("USER UPDATE ERROR", err);
				return res.status(400).json({ error: "User update failed" });
			} else {
				res.json(updatedProfile);
			}
		}
	);
};

exports.deleteProfile = () => {
	Profile.findOneAndDelete(
		{ user_id: req.user._id },
		(err, deletedProfile) => {
			if (err) {
				console.log("USER DELETE ERROR", err);
				return res.status(400).json({ error: "User delete failed" });
			} else {
				return res.json({ deletedProfile });
			}
		}
	);
};
