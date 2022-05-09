const router = require("express").Router();
const { createReply, deleteReply } = require("../controllers/comment");
const { isAuth } = require("../utils/utils");
const { createReplyValidator } = require("../validators/comment");

router.put("/:comment_id/replies", isAuth, createReplyValidator, createReply);
router.delete("/:comment_id/replies/:reply_id", isAuth, deleteReply);

module.exports = router;
