const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        messageType: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            default: "",
        },
        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            default: "delivered",
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Message", MessageSchema);
