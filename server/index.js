require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("nice");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`listening on port ${5000}`);
});
