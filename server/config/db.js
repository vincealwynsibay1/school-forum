const mongoose = require("mongoose");

const connectDB = () => {
	mongoose
		.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("DB Connection Succesful!");
		})
		.catch((err) => console.error(err.message));
};

export default connectDB;
