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
    InternalServerError,
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

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const friendId = req.params.id;

    const exchangedMessages = await getExchangedMessages(userId, friendId);

    if (exchangedMessages.length > 0) {
        res.status(StatusCodes.OK).json({ currentMessages: exchangedMessages });
    } else {
        res.status(StatusCodes.OK).json({ currentMessages: [] });
    }
};

module.exports.sendMessage = async (req, res) => {
    const userEmail = req.email;

    const { _id: senderId } = await User.findOne({ email: userEmail });
    const { messageType, senderName, receiverId, content } = req.body;

    const messageSent = await Message.create({
        messageType,
        content,
        senderId,
        senderName,
        receiverId,
    });

    if (!messageSent) {
        throw new InternalServerError("Failed to save message.");
    }

    res.status(StatusCodes.CREATED).json({ messageSent });
};

module.exports.updateMessageStatusToSeen = async (req, res) => {
    const { _id: messageId } = req.body.message;

    const result = await Message.findByIdAndUpdate(messageId, {
        status: "seen",
    });

    if (!result) {
        throw new NotFoundError("Message not found.");
    }

    res.sendStatus(StatusCodes.OK);
};

module.exports.getTheme = async (req, res) => {
    const userEmail = req.email;

    const { preferredTheme } = await User.findOne({ email: userEmail });

    if (!preferredTheme) {
        throw new NotFoundError("User not found.");
    }

    res.status(StatusCodes.OK).json({ preferredTheme });
};

module.exports.setTheme = async (req, res) => {
    const userEmail = req.email;

    const { preferredTheme: theme } = req.body;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const result = await User.findByIdAndUpdate(userId, {
        preferredTheme: theme,
    });

    if (!result) {
        throw new InternalServerError("Failed to save preferred theme.");
    }

    res.sendStatus(StatusCodes.OK);
};
