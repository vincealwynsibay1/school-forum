require("dotenv").config();
const mongoose = require("mongoose");
const { topics, communities, descriptors } = require("./seedHelpers");
const gravatar = require("gravatar");
const User = require("../models/User");
const Group = require("../models/Group");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const Comment = require("../models/Comment");

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedUserAndProfile = async () => {
	console.log("Seeding User and Profile...");
	await User.deleteMany({});
	await Profile.deleteMany({});
	const users = [];
	const profiles = [];
	const admin = new User({
		username: "admin",
		email: "admin@admin.com",
		passwordHash: "admin",
		role: "admin",
	});
	const savedAdmin = await admin.save();
	users.push(savedAdmin);

	// Create Profile for Admin

	for (let i = 0; i < 10; i++) {
		const user = new User({
			username: `user_${i}`,
			email: `user_${i}@email.com`,
			passwordHash: `user_${i}_password`,
		});
		const savedUser = await user.save();
		users.push(savedUser);

		// create profiles for each user
		const avatarUrl = gravatar.url(user.email, {
			s: "200",
			r: "pg",
			d: "identicon",
		});

		const profile = new Profile({
			user_id: savedUser._id,
			avatar: { url: avatarUrl, fileName: "identicon" },
			username: savedUser.username,
		});
		const savedProfile = await profile.save();
		profiles.push(savedProfile);
	}

	console.log("Seeding User and Profile Complete.");
	return { users, profiles };
};

const seedGroup = async (users) => {
	console.log("Seeding Group...");
	await Group.deleteMany({});
	const groups = [];

	for (let i = 0; i < 3; i++) {
		const moderators = [];

		for (let j = 0; j < 2; j++) {
			moderators.push(users[j]._id);
		}

		const name = sample(communities);

		const photoUrl = gravatar.url(`${name}@group`, {
			s: "200",
			r: "pg",
			d: "retro",
		});

		const group = new Group({
			name,
			moderators,
			groupPhoto: { url: photoUrl, fileName: "retro" },
		});

		const savedGroup = await group.save();
		groups.push(savedGroup);
	}
	console.log("Seeding Group Complete.");
	return groups;
};
const seedPosts = async (users, groups) => {
	console.log("Seeding Post...");
	await Post.deleteMany({});
	const posts = [];

	for (let group of groups) {
		for (let i = 0; i < 10; i++) {
			const comments = [];

			for (let j = 0; j < 5; j++) {
				const replies = [];
				for (let k = 0; k < 2; k++) {
					const reply = new Comment({
						user_id: sample(users),

						content:
							"Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
					});
					const savedReply = await reply.save();
					replies.push(savedReply);
				}

				const comment = new Comment({
					user_id: sample(users),
					content:
						"Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
					replies,
				});

				const savedComment = await comment.save();
				comments.push(savedComment);
			}

			const post = new Post({
				title: `${sample(descriptors)} ${sample(topics)}`,
				content:
					"Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
				group: group._id,
				comments,
				user_id: sample(users),
			});
			``;
			const savedPost = await post.save();
			const parentGroup = await Group.findById(group._id);
			parentGroup.posts.push(savedPost._id);
			await parentGroup.save();
			posts.push(savedPost);
		}
		console.log("Seeding Post Complete.");

		return posts;
	}
};

const seedDB = async () => {
	try {
		// const { users } = await seedUserAndProfile();
		// const group = await seedGroup(users);
		// await seedPosts(users, group);
		await User.deleteMany();
		await Group.deleteMany();
		await Post.deleteMany();
	} catch (err) {
		console.log(err.message);
	}
};

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");

	seedDB();
});

process.on("SIGINT", function () {
	mongoose.connection.close(function () {
		console.log("Mongoose disconnected on app termination");
		process.exit(0);
	});
});
