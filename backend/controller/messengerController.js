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
        .populate("friends.friendId"); // Populate the friendId field within the friends array

    if (userFriends.length > 0) {
        for (let i = 0; i < userFriends.length; i++) {
            const latestMessage = await getLatestMessage(
                userId,
                userFriends[i].friendId.id // Access the friendId's _id property
            );
            chatList = [
                ...chatList,
                {
                    friendInfo: userFriends[i].friendId,
                    friendshipTimestamp: userFriends[i].friendshipTimestamp,
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

module.exports.getAllUsers = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { page, search } = req.query;

    const queryObject = {};

    if (search) {
        // Create a regex pattern for the search query
        const regex = new RegExp(search.replace(/\s+/, ""), "i");

        // Add the regex pattern to the query object
        queryObject.$or = [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
        ];
    }

    // Get the user's friend IDs
    const { friends, friendRequestSent, friendRequestReceived } =
        await User.findById(userId, {
            friends: 1,
            friendRequestSent: 1,
            friendRequestReceived: 1,
        });

    // Exclude the user's friends and the logged in user
    queryObject._id = {
        $nin: [
            userId,
            ...friends.map((friend) => friend.friendId),
            ...friendRequestSent.map((request) => request.userId),
            ...friendRequestReceived.map((request) => request.userId),
        ],
    };

    const users = await User.find(queryObject)
        .skip((page - 1) * 5)
        .limit(5);

    res.status(StatusCodes.OK).json({ users });
};

module.exports.getFriendRequestSent = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { friendRequestSent } = await User.findById(userId)
        .select("friendRequestSent")
        .populate("friendRequestSent.userId");

    if (friendRequestSent.length > 0) {
        const friendRequestSentData = friendRequestSent.map((user) => ({
            userData: { ...user.userId._doc },
            timeSent: user.timeSent,
        }));

        friendRequestSentData.sort((a, b) => b.timeSent - a.timeSent);

        res.status(StatusCodes.OK).json({
            friendRequestSent: friendRequestSentData,
        });
    } else {
        res.status(StatusCodes.OK).json({ friendRequestSent: [] });
    }
};

module.exports.getFriendRequestReceived = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { friendRequestReceived } = await User.findById(userId)
        .select("friendRequestReceived")
        .populate("friendRequestReceived.userId");

    if (friendRequestReceived.length > 0) {
        const friendRequestReceivedData = friendRequestReceived.map((user) => ({
            userData: { ...user.userId._doc },
            timeReceived: user.timeReceived,
        }));

        friendRequestReceivedData.sort(
            (a, b) => b.timeReceived - a.timeReceived
        );

        res.status(StatusCodes.OK).json({
            friendRequestReceived: friendRequestReceivedData,
        });
    } else {
        res.status(StatusCodes.OK).json({ friendRequestReceived: [] });
    }
};

module.exports.sendFriendRequest = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { receiverId } = req.body;

    const receiver = await User.findOne({ _id: receiverId });

    if (!receiver) {
        throw new NotFoundError("Receiver not found.");
    }

    const timeSent = new Date();

    // Update the user's friendRequestSent array
    const updatedUserData = await User.findOneAndUpdate(
        { _id: userId },
        {
            $push: {
                friendRequestSent: { userId: receiverId, timeSent },
            },
        },
        { new: true } // Retrieve the updated document
    );

    // Update the receiver's friendRequestReceived array
    const updatedReceiverData = await User.findOneAndUpdate(
        { _id: receiverId },
        {
            $push: {
                friendRequestReceived: {
                    userId: userId,
                    timeReceived: timeSent,
                },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedReceiverData) {
        throw new NotFoundError("Receiver not found.");
    }

    res.status(StatusCodes.OK).json({
        receiver: { userData: updatedReceiverData, timeSent },
        sender: { userData: updatedUserData, timeReceived: timeSent },
    });
};

module.exports.cancelSentFriendRequest = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { receiverOfRequestId } = req.body;

    // Update the user's friendRequestSent array
    const updatedUserData = await User.findOneAndUpdate(
        { _id: userId },
        {
            $pull: {
                friendRequestSent: { userId: receiverOfRequestId },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedUserData) {
        throw new NotFoundError("User not found.");
    }

    // Update the receiver's friendRequestReceived array
    const updatedReceiverOfTheRequestData = await User.findOneAndUpdate(
        { _id: receiverOfRequestId },
        {
            $pull: {
                friendRequestReceived: { userId: userId },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedReceiverOfTheRequestData) {
        throw new NotFoundError("Receiver not found.");
    }

    res.sendStatus(StatusCodes.OK);
};

module.exports.declineReceivedFriendRequest = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { senderOfRequestId } = req.body;

    // Update the user's friendRequestReceived array
    const updatedUserData = await User.findOneAndUpdate(
        { _id: userId },
        {
            $pull: {
                friendRequestReceived: { userId: senderOfRequestId },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedUserData) {
        throw new NotFoundError("User not found.");
    }

    // Update the sender's friendRequestSent array
    const updatedSenderOfTheRequestData = await User.findOneAndUpdate(
        { _id: senderOfRequestId },
        {
            $pull: {
                friendRequestSent: { userId: userId },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedSenderOfTheRequestData) {
        throw new NotFoundError("Receiver not found.");
    }

    console.log("updatedUserData", updatedUserData);
    console.log("updatedSenderOfTheRequestData", updatedSenderOfTheRequestData);

    res.sendStatus(StatusCodes.OK);
};

module.exports.acceptReceivedFriendRequest = async (req, res) => {
    const userEmail = req.email;

    const { _id: userId } = await User.findOne({ email: userEmail });

    if (!userId) {
        throw new NotFoundError("User not found.");
    }

    const { senderOfRequestId } = req.body;

    const friendshipTimestamp = Date.now();

    // Update the user's friendRequestReceived array
    const updatedUserData = await User.findOneAndUpdate(
        { _id: userId },
        {
            $pull: {
                friendRequestReceived: { userId: senderOfRequestId },
            },
            $push: {
                friends: {
                    friendId: senderOfRequestId,
                    friendshipTimestamp,
                },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedUserData) {
        throw new NotFoundError("User not found.");
    }

    // Update the sender's friendRequestSent array
    const updatedSenderOfTheRequestData = await User.findOneAndUpdate(
        { _id: senderOfRequestId },
        {
            $pull: {
                friendRequestSent: { userId: userId },
            },
            $push: {
                friends: {
                    friendId: userId,
                    friendshipTimestamp,
                },
            },
        },
        { new: true } // Retrieve the updated document
    );

    if (!updatedSenderOfTheRequestData) {
        throw new NotFoundError("Receiver not found.");
    }

    console.log("updatedUserData", updatedUserData);
    console.log("updatedSenderOfTheRequestData", updatedSenderOfTheRequestData);

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
