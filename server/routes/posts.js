const { getAll } = require("../controllers/post");
const Post = require("../models/Post");
const { paginatedResults } = require("../utils/utils");
const router = require("express").Router();
// @route  GET api/posts/
// @desc   Get all posts
// @access Public
router.get("/", paginatedResults(Post), getAll);

module.exports = router;
