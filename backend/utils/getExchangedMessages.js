const Message = require("../models/Message");

const getExchangedMessages = async (userId, friendId) => {
    const exchangedMessages = await Message.find({
        $or: [
            {
                $and: [
                    {
                        senderId: {
                            $eq: userId,
                        },
                    },
                    {
                        receiverId: {
                            $eq: friendId,
                        },
                    },
                ],
            },
            {
                $and: [
                    {
                        senderId: {
                            $eq: friendId,
                        },
                    },
                    {
                        receiverId: {
                            $eq: userId,
                        },
                    },
                ],
            },
        ],
    });

    return exchangedMessages;
};

module.exports = getExchangedMessages;
