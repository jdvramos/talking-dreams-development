const router = require("express").Router();

const {
    getChatList,
    getCurrentMessages,
    sendMessage,
    updateMessageStatusToSeen,
    getAllUsers,
    getFriendRequestSent,
    getFriendRequestReceived,
    sendFriendRequest,
    cancelSentFriendRequest,
    declineReceivedFriendRequest,
    acceptReceivedFriendRequest,
    updateAllFriendRequestsToSeen,
    getTheme,
    setTheme,
} = require("../controller/messengerController");

router.get("/get-chatlist", getChatList);
router.get("/get-current-messages/:id", getCurrentMessages);
router.post("/send-message", sendMessage);
router.patch("/update-to-seen", updateMessageStatusToSeen);
router.get("/get-all-users", getAllUsers);
router.get("/get-fr-sent", getFriendRequestSent);
router.get("/get-fr-received", getFriendRequestReceived);
router.post("/send-fr", sendFriendRequest);
router.patch("/cancel-fr", cancelSentFriendRequest);
router.patch("/decline-fr", declineReceivedFriendRequest);
router.post("/accept-fr", acceptReceivedFriendRequest);
router.patch("/update-all-fr-to-seen", updateAllFriendRequestsToSeen);
router.get("/get-theme", getTheme);
router.patch("/set-theme", setTheme);

module.exports = router;
