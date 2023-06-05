import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    chatList: [],
    currentFriend: null,
    currentMessages: [],
    onlineFriends: [],
    currentFriendIsTypingInfo: null,
    messageSent: false,
    socketMessage: "",
    friendRequestSent: [],
    friendRequestReceived: [],
    preferredTheme: "light",
};

const messengerSlice = createSlice({
    name: "messenger",
    initialState,
    reducers: {
        setChatList(state, action) {
            const { chatList } = action.payload;
            state.chatList = chatList;
        },
        setCurrentFriend(state, action) {
            const { currentFriend } = action.payload;
            state.currentFriend = currentFriend;
        },
        setCurrentMessages(state, action) {
            const { currentMessages } = action.payload;
            state.currentMessages = currentMessages;
        },
        setOnlineFriends(state, action) {
            const { onlineFriends } = action.payload;
            state.onlineFriends = onlineFriends;
        },
        setCurrentFriendIsTypingInfo(state, action) {
            const { typingInfo } = action.payload;
            state.currentFriendIsTypingInfo = typingInfo;
        },
        setMessageSentToTrue(state, action) {
            const { messageSent } = action.payload;
            state.messageSent = true;
            state.currentMessages.push(messageSent);
        },
        setMessageSentToFalse(state) {
            state.messageSent = false;
        },
        setSocketMessage(state, action) {
            const { socketMessage } = action.payload;
            state.socketMessage = socketMessage;
        },
        setFriendRequestSent(state, action) {
            const { friendRequestSent } = action.payload;
            state.friendRequestSent = friendRequestSent;
        },
        setFriendRequestReceived(state, action) {
            const { friendRequestReceived } = action.payload;
            state.friendRequestReceived = friendRequestReceived;
        },
        appendNewFriendRequestSent(state, action) {
            const { data } = action.payload;
            state.friendRequestSent.unshift(data);
        },
        removeFriendRequestSent(state, action) {
            const { receiverId } = action.payload;
            // Filtering does not work (https://stackoverflow.com/questions/67436949/removing-a-value-from-an-array-using-redux-toolkit)
            state.friendRequestSent.splice(
                state.friendRequestSent.findIndex(
                    (sentFR) => sentFR.id === receiverId
                ),
                1
            );
        },
        appendNewFriendRequestReceived(state, action) {
            const { data } = action.payload;
            state.friendRequestReceived.unshift(data);
        },
        removeFriendRequestReceived(state, action) {
            const { senderId } = action.payload;
            // Filtering does not work (https://stackoverflow.com/questions/67436949/removing-a-value-from-an-array-using-redux-toolkit)
            state.friendRequestReceived.splice(
                state.friendRequestReceived.findIndex(
                    (receivedFR) => receivedFR.id === senderId
                ),
                1
            );
        },
        setPreferredTheme(state, action) {
            const { preferredTheme } = action.payload;
            state.preferredTheme = preferredTheme;
        },
        insertSocketMessageToCurrentMessages(state, action) {
            const { socketMessage } = action.payload;
            state.currentMessages.push(socketMessage);
        },
        updateLatestMessageOnChatList(state, action) {
            // After sending a message
            const { latestMessage } = action.payload;
            const indexOfItemToUpdate = state.chatList.findIndex(
                (friend) =>
                    friend.friendInfo._id === latestMessage.receiverId ||
                    friend.friendInfo._id === latestMessage.senderId
            );
            state.chatList[indexOfItemToUpdate].latestMessage = latestMessage;
        },
        updateLatestMessageStatusOnChatList(state, action) {
            const { latestMessage } = action.payload;

            const indexOfItemToUpdate = state.chatList.findIndex(
                (friend) =>
                    friend.friendInfo._id === latestMessage.receiverId ||
                    friend.friendInfo._id === latestMessage.senderId
            );
            state.chatList[indexOfItemToUpdate].latestMessage = latestMessage;
        },
        updateLastMessageToSeenOnCurrentMessages(state, _action) {
            const lastMessageIndex = state.currentMessages.length - 1;
            if (lastMessageIndex >= 0) {
                state.currentMessages[lastMessageIndex].status = "seen";
            }
        },
        resetState(state) {
            Object.assign(state, initialState);
        },
    },
});

export const getChatList = (state) => state.messenger.chatList;
export const getCurrentFriend = (state) => state.messenger.currentFriend;
export const getCurrentMessages = (state) => state.messenger.currentMessages;
export const getOnlineFriends = (state) => state.messenger.onlineFriends;
export const getCurrentFriendIsTypingInfo = (state) =>
    state.messenger.currentFriendIsTypingInfo;
export const getMessageSent = (state) => state.messenger.messageSent;
export const getSocketMessage = (state) => state.messenger.socketMessage;
export const getFriendRequestSent = (state) =>
    state.messenger.friendRequestSent;
export const getFriendRequestReceived = (state) =>
    state.messenger.friendRequestReceived;
export const getPreferredTheme = (state) => state.messenger.preferredTheme;

export const {
    setChatList,
    setCurrentFriend,
    setCurrentMessages,
    setOnlineFriends,
    setCurrentFriendIsTypingInfo,
    setMessageSentToTrue,
    setMessageSentToFalse,
    setSocketMessage,
    setFriendRequestSent,
    appendNewFriendRequestSent,
    removeFriendRequestSent,
    setFriendRequestReceived,
    appendNewFriendRequestReceived,
    removeFriendRequestReceived,
    setPreferredTheme,
    insertSocketMessageToCurrentMessages,
    updateLatestMessageOnChatList,
    updateLatestMessageStatusOnChatList,
    updateLastMessageToSeenOnCurrentMessages,
    resetState,
} = messengerSlice.actions;

export default messengerSlice.reducer;
