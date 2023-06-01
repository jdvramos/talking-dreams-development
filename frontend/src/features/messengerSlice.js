import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    chatList: [],
    currentFriend: null,
    currentMessages: [],
    onlineFriends: [],
    messageSent: false,
    socketMessage: "",
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
            // After receiving a socket message
            const { latestMessage } = action.payload;

            const indexOfItemToUpdate = state.chatList.findIndex(
                (friend) =>
                    friend.friendInfo._id === latestMessage.receiverId ||
                    friend.friendInfo._id === latestMessage.senderId
            );
            state.chatList[indexOfItemToUpdate].latestMessage = latestMessage;
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
export const getMessageSent = (state) => state.messenger.messageSent;
export const getSocketMessage = (state) => state.messenger.socketMessage;

export const {
    setChatList,
    setCurrentFriend,
    setCurrentMessages,
    setOnlineFriends,
    setMessageSentToTrue,
    setMessageSentToFalse,
    setSocketMessage,
    insertSocketMessageToCurrentMessages,
    updateLatestMessageOnChatList,
    updateLatestMessageStatusOnChatList,
    resetState,
} = messengerSlice.actions;

export default messengerSlice.reducer;
