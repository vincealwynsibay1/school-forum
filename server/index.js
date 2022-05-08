require("dotenv").config();
const express = require("express");
require("./config/db")();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// import routes

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// routes

app.get("/", (req, res) => {
	res.send("nice");
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/../client/index.html"));
});
app.use((err, req, res, next) => {
	const status = err.name && err.name === "ValidationError" ? 400 : 500;
	res.status(status).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`listening on port ${5000}`);
});
