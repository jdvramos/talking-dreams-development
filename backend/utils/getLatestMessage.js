const Message = require("../models/Message");

const getLatestMessage = async (userId, friendId) => {
    const latestMessage = await Message.findOne({
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
    }).sort({
        updated_at: -1,
    });

    return latestMessage;
};

module.exports = getLatestMessage;
