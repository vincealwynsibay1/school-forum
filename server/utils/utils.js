require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports.isAuth = (req, res, next) => {
	const token = req.header("token");

	if (!token) {
		return res
			.status(401)
			.json({ message: "No token, authorization not allowed" });
	}

	try {
		jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
			if (err) {
				res.status(401).json({ message: "Invalid Token" });
			} else {
				req.user = data;
				next();
			}
		});
	} catch (err) {
		console.error("Something wrong with auth middleware");
		res.status(500).json({ message: "Server Error" });
	}
};

module.exports.isAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(401).send({ message: "Token is not valid for admin user" });
	}
};

module.exports.paginatedResultsByArr = (arr, page = 1, limit = 3) => {
	if (arr.length === 0) {
		return [];
	}
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const results = {};

	if (endIndex < arr.length) {
		results.next = {
			page: page + 1,
			limit: limit,
		};
	}

	if (startIndex > arr.length) {
		results.prev = {
			page: page - 1,
			limit: limit,
		};
	}

	results.documents = arr.slice(startIndex, endIndex);
	return results;
};

module.exports.paginatedResults = (model) => {
	return async (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const sort = req.query.sort;
		const s = req.query.s;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results = {};

		if (endIndex < (await model.countDocuments().exec())) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (startIndex > (await model.countDocuments().exec())) {
			results.prev = {
				page: page - 1,
				limit: limit,
			};
		}

		results.documents = await model
			.find({})
			.limit(limit)
			.skip(startIndex)
			.exec();

		try {
			if (sort) {
				switch (sort) {
					case "top":
						if (model.modelName === "Group") {
							if (s) {
								lts.documents = await model
									.find({ name: `/.*${s}.*/i` })
									.limit(limit)
									.sort({ members: -1 })
									.skip(startIndex);
							} else {
								results.documents = await model
									.find({})
									.limit(limit)
									.sort({ members: -1 })
									.skip(startIndex)
									.exec();
							}
						} else if (model.modelName === "Post") {
							if (s) {
								results.documents = await model
									.find({ title: `/.*${s}.*/i` })
									.limit(limit)
									.sort({ upvotes: -1 })
									.skip(startIndex)
									.exec();
							} else {
								results.documents = await model
									.find({})
									.limit(limit)
									.sort({ upvotes: -1 })
									.skip(startIndex)
									.exec();
							}
						} else if (model.modelName === "Comment") {
							results.documents = await model
								.find({})
								.limit(limit)
								.sort({ upvotes: -1 })
								.skip(startIndex)
								.exec();
						} else if (model.modelName === "Profile") {
							results.documents = await model
								.find({})
								.limit(limit)
								.sort({ followers: -1 })
								.skip(startIndex)
								.exec();
							``;
						}
						break;
					case "newest":
						if (s) {
							if (model.modelName === "Group") {
								results.documents = await model
									.find({ name: `/.*${s}.*/i` })
									.limit(limit)
									.sort({ created_at: -1 })
									.skip(startIndex)
									.exec();
							} else if (model.modelName === "Post") {
								results.documents = await model
									.find({ title: `/.*${s}.*/i` })
									.limit(limit)
									.sort({ created_at: -1 })
									.skip(startIndex)
									.exec();
							}
						} else {
							results.documents = await model
								.find({})
								.limit(limit)
								.sort({ created_at: -1 })
								.skip(startIndex)
								.exec();
						}
						break;
				}
			} else {
				if (s) {
					if (model.modelName === "Group") {
						results.documents = await model
							.find({ name: `/.*${s}.*/i` })
							.limit(limit)
							.skip(startIndex)
							.exec();
					} else if (model.modelName === "Post") {
						results.documents = await model
							.find({ title: `/.*${s}.*/i` })
							.limit(limit)
							.skip(startIndex)
							.exec();
					} else if (model.modelName === "Profile") {
						results.documents = await model
							.find({
								username: { $regex: `.*${s}.*`, $options: "i" },
							})
							.limit(limit)
							.skip(startIndex)
							.exec();
					}
				} else {
					results.documents = await model
						.find({})
						.limit(limit)
						.skip(startIndex)
						.exec();
				}
			}

			res.paginatedResults = results;
			next();
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	};
};
