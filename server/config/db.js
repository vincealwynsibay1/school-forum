const mongoose = require("mongoose");

const connectDB = () => {
	mongoose
		.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("DB Connection Succesful!");
		})
		.catch((err) => console.error(err.message));
};

module.exports = connectDB;
