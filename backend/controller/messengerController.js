const User = require("../models/User");
const Message = require("../models/Message");
const getLatestMessage = require("../utils/getLatestMessage");
const getExchangedMessages = require("../utils/getExchangedMessages");
const { StatusCodes } = require("http-status-codes");

const {
    BadRequestError,
    Conflict,
    UnAuthenticatedError,
    NotFoundError,
} = require("../errors/index");

module.exports.getChatList = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    let chatList = [];

    const { friends: userFriends } = await User.findById(userId)
        .select("friends")
        .populate("friends");

    if (userFriends.length > 0) {
        for (let i = 0; i < userFriends.length; i++) {
            const latestMessage = await getLatestMessage(
                userId,
                userFriends[i].id
            );
            chatList = [
                ...chatList,
                {
                    friendInfo: userFriends[i],
                    latestMessage,
                },
            ];
        }

        res.status(StatusCodes.OK).json({ chatList });
    } else {
        res.status(StatusCodes.OK).json({ chatList: [] });
    }
};

module.exports.getCurrentMessages = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });
    const friendId = req.params.id;

    const exchangedMessages = await getExchangedMessages(userId, friendId);

    if (exchangedMessages.length > 0) {
        res.status(StatusCodes.OK).json({ currentMessages: exchangedMessages });
    } else {
        res.status(StatusCodes.OK).json({ currentMessages: [] });
    }
};
