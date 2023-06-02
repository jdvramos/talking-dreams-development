const router = require("express").Router();

const {
    getChatList,
    getCurrentMessages,
    sendMessage,
    updateMessageStatusToSeen,
    getTheme,
    setTheme,
} = require("../controller/messengerController");

router.get("/get-chatlist", getChatList);
router.get("/get-current-messages/:id", getCurrentMessages);
router.post("/send-message", sendMessage);
router.patch("/update-to-seen", updateMessageStatusToSeen);
router.get("/get-theme", getTheme);
router.patch("/set-theme", setTheme);

module.exports = router;
