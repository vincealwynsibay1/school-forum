const mongoose = require("mongoose");
const { topics, communities, descriptors } = require("./seedHelpers");

const User = require("../models/User");
const Group = require("../models/Group");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const Comment = require("../models/Comment");
const connectDB = require("../config/db");

connectDB();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedUserAndProfile = async () => {
	await User.deleteMany({});
	await Profile.deleteMany({});
	const users = [];
	const profiles = [];
	const admin = new User({
		username: "admin",
		email: "admin@admin.com",
		passwordHash: admin,
		role: "admin",
	});
	const savedAdmin = await admin.save();
	users.push(savedAdmin);

	// Create Profile for Admin

	for (let i = 0; i < 10; i++) {
		const user = new User({
			username: `user_${i}`,
			email: `user_${i}@email.com`,
			password: `user_${i}_password`,
		});
		const savedUser = await user.save();
		users.push(savedUser);
	}


    // create profiles for each user
	users.forEach((user) => {
		const avatarUrl = gravatar.url(user.email, {
			s: "200",
			r: "pg",
			d: "identicon",
		});

		const profile = new Profile({
			user_id: user._id,
			avatar: { url: avatarUrl, fileName: "identicon" },
			username: user.username,
		});
        const savedProfile = await profile.save(savedProfile);
        profiles.push(savedProfile)
	});

	return {users, profiles};
};

const seedGroup = async (users) => {
    await Group.deleteMany({})
    const groups = []

    for (let i = 0; i < 3; i++) {
        const moderators = []

        for (let j = 0; j < 2; j++) {
            moderators.push(users)
        }

        const photoUrl = gravatar.url("group@group", {
            s: "200",
            r: "pg",
            d: "retro",
        });
            
            const group = new Group({
                name: sample(communities),
                moderators,
                groupPhoto: photoUrl
        })

        const savedGroup = await group.save()
        groups.push(savedGroup)
    }
    

    return groups
};
const seedPosts = async (users, groups) => {
    await Post.deleteMany({})
    const posts = []

    for (let group of groups) {
        
        for (let i = 0; i < 10; i++) {
            const comments = []

            for (let i = 0; i < 5; j++) {
                const replies = []
                for (let i = 0; i < 2; j++) { 
                    const reply = new Comment({
                        user_id: sample(users),
                        content: "Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
                    })
                    const savedReply = await reply.save()
                    replies.push(savedReply)
                }

                const comment = new Comment({
                    user_id: sample(users),
                    content: "Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
                    replies
                })

                const savedComment = await comment.save()
            }


            const post = new Post({
                title: `${sample(descriptors)} ${topics}`,
                content: "Lorem ipsum dolor sit amet. Vel blanditiis suscipit non internos eveniet et provident dolorem. Et labore inventore vel quia tempora a autem consequatur aut eligendi dolor?",
                group: group._id,
                comments,
                user_id: sample(users)
            }) 

            const savedPost = post.save()
            posts.push(savedPost)
        }

        return posts

    }
};

const seedDB = async () => {
    const {users} = await seedUserAndProfile()
    const group = await seedGroup(users)
    await seedPosts(users, group)
};

seedDB().then(() => {
    mongoose.connection.close();
})
