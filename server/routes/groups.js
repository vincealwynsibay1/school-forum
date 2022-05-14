const {
	deleteGroup,
	update,
	create,
	getById,
	getAll,
	join,
	updateModerators,
	leave,
	updatePhoto,
} = require("../controllers/group");
const Group = require("../models/Group");
const { isAuth, paginatedResults } = require("../utils/utils");
const { createGroupValidator } = require("../validators/group");

const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { runValidation } = require("../validators");
const upload = multer({ storage });
const router = require("express").Router();

// @route GET api/groups/
// @desc GET all groups
// @access Public
router.get("/", paginatedResults(Group), getAll);

// @route GET api/groups/:group_id
// @desc GET group by id
// @access Public
router.get("/:group_id", getById);

// @route POST api/groups/:group_id
// @desc  Create group
// @access Private
router.post("/", isAuth, create);

// @route PUT api/groups/:group_id
// @desc  Update group's name, description, and/or rules
// @access Private
router.put("/:group_id", isAuth, update);

// @route PUT api/groups/:group_id/photo
// @desc  Update group's photo
// @access Private
router.put("/:group_id", isAuth, upload.single("groupPhoto"), updatePhoto);

// @route DELETE api/groups/:group_id
// @desc  Delete group
// @access Private
router.delete("/:group_id", isAuth, deleteGroup);

// @route PUT api/groups/:group_id/join
// @desc  Join group
// @access Private
router.put("/:group_id/join", isAuth, join);

// @route PUT api/groups/:group_id/leave
// @desc  Leave group
// @access Private
router.put("/:group_id/leave", isAuth, leave);

// @route PUT api/groups/:group_id/moderators
// @desc  Update group moderators
// @access Private
router.put("/:group_id/moderators", isAuth, updateModerators);

module.exports = router;
