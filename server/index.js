require("dotenv").config();
const express = require("express");
require("./config/db")();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// import routes

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/group", require("./routes/groups"));
app.use("/api/posts", require("./routes/posts"));

app.use((err, req, res, next) => {
	const status = err.name && err.name === "ValidationError" ? 400 : 500;
	res.status(status).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`listening on port ${5000}`);
});
