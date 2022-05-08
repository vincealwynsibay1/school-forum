const router = require("express").Router();
const { userById, update } = require("../controllers/auth");
const { isAuth } = require("../utils/utils");

router.get("/secret/:user_id", isAuth, isAdmin, (req, res) => {
	res.json({ user: req.profile });
});
router.get("/", isAuth, read);
router.put("/", isAuth, update);
module.exports = router;
