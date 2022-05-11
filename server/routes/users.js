const router = require("express").Router();
const { update, deleteUser, getAll } = require("../controllers/user");
const { isAuth, isAdmin } = require("../utils/utils");
const { userUpdateValidator } = require("../validators/user");

// @route    PUT api/users/
// @desc     Get all users
// @access   Private
router.get("/", isAuth, isAdmin, getAll);

// @route    PUT api/users/:user
// @desc     Update current user
// @access   Private
router.put("/:user_id", isAuth, update);

// @route    DELETE api/users/me
// @desc     Delete current user
// @access   Private
router.delete("/:user_id", isAuth, deleteUser);

module.exports = router;
