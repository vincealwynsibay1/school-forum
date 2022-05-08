import Profile from "../models/Profile";

const jwt = require("jsonwebtoken");

export const generateToken = (id) => {
	return jwt.sign(
		{
			_id: id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
};

export const isAuth = (req, res, next) => {
	const bearerToken = req.header("x-auth-bearerToken");

	if (!bearerToken) {
		return res
			.status(401)
			.json({ error: "No token, authorization not allowed" });
	}

	try {
		const token = token.slice(7, bearerToken.length);
		jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
			if (err) {
				res.status(401).json({ error: "Invalid Token" });
			} else {
				req.user = data;
				next();
			}
		});
	} catch (err) {
		console.error("Something wrong with auth middleware");
		res.status(500).json({ error: "Server Error" });
	}
};

export const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(401).send({ message: "Token is not valid for admin user" });
	}
};
