const router = require("express").Router();

const {
    getChatList,
    getCurrentMessages,
} = require("../controller/messengerController");

router.get("/get-chatlist", getChatList);
router.get("/get-current-messages/:id", getCurrentMessages);

module.exports = router;
