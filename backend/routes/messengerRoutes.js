const router = require("express").Router();

const {
    getChatList,
    getCurrentMessages,
    sendMessage,
} = require("../controller/messengerController");

router.get("/get-chatlist", getChatList);
router.get("/get-current-messages/:id", getCurrentMessages);
router.post("/send-message", sendMessage);

module.exports = router;
