const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
	url: String,
	filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});

module.exports = ImageSchema;
