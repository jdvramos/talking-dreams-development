const io = require("socket.io")(8001, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let onlineUsers = [];

const addUser = (userId, socketId, userInfo) => {
    // Checks if the user that is connected, already exist in the onlineUsers array
    const alreadyExist = onlineUsers.some((u) => u.userId === userId);

    if (!alreadyExist) {
        onlineUsers.push({ userId, socketId, userInfo });
    }
};

const userRemove = (socketId) => {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

// This functions returns a user information if the id that is passed in is in the 'onlineUsers' array which corresponds to users that are currently online
const findFriend = (id) => {
    return onlineUsers.find((u) => u.userId === id);
};

const userLogout = (userId) => {
    onlineUsers = onlineUsers.filter((u) => u.userId !== userId);
};

io.on("connection", (socket) => {
    console.log("A user connected");

    // The addUser event will fire whenever a user successfully logs in (when Messenger.jsx mounts) and then after we will fire the getUser event
    socket.on("addUser", (userId, userInfo) => {
        addUser(userId, socket.id, userInfo);
        io.emit("getAllOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message) => {
        const friendData = findFriend(message.receiverId);

        // Basically, we want our real-time communication to work only if the receiver of the message is online, if not we will simply append the new message to our database. If user is undefined it means that the receiver is not in the 'users' array which means that the receiver is currently offline.
        // NOTE: We used socket.to(user.socketId).emit(), this was discussed in the fundamentals section but in that lesson we setup rooms. However, in Socket.io you can also pass in socket.id as argument to the socket.to(), here we pass in the socketId of the receiver, this means that our getMessage action will only be emitted to that user and not anyone else.
        if (friendData !== undefined) {
            socket.to(friendData.socketId).emit("receiveMessage", message);
        }
    });

    socket.on("messageSeenByFriend", (seenSocketMessage) => {
        const user = findFriend(seenSocketMessage.senderId);

        if (user !== undefined) {
            socket
                .to(user.socketId)
                .emit("messageSeenByFriendResponse", seenSocketMessage);
        }
    });

    socket.on("friendIsTyping", (typingInfo) => {
        const user = findFriend(typingInfo.receiverId);

        if (user !== undefined) {
            socket.to(user.socketId).emit("friendIsTypingResponse", typingInfo);
        }
    });

    socket.on("logout", (userId) => {
        userLogout(userId);
        io.emit("getAllOnlineUsers", onlineUsers);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected...");
        userRemove(socket.id);
        io.emit("getAllOnlineUsers", onlineUsers);
    });
});
