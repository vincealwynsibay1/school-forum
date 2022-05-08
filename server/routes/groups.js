const {
	deleteGroup,
	update,
	create,
	getById,
	getAll,
	join,
	updateModerators,
	leave,
} = require("../controllers/group");
const { isAuth } = require("../utils/utils");

const router = require("express").Router();

// @route GET api/groups/
// @desc GET all groups
// @access Public
router.get("/", getAll);

// @route GET api/groups/:group_id
// @desc GET group by id
// @access Public
router.get("/:group_id", getById);

// @route POST api/groups/:group_id
// @desc  Create group
// @access Private
router.post("/:group_id", isAuth, create);

// @route PUT api/groups/:group_id
// @desc  Update group's name, description, and/or rules
// @access Private
router.put("/:group_id", isAuth, update);

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
router.get("/:group_id/moderators", isAuth, updateModerators);

module.exports = router;
