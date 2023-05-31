import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    chatList: [],
    currentMessages: [],
};

const messengerSlice = createSlice({
    name: "messenger",
    initialState,
    reducers: {
        setChatList(state, action) {
            const { chatList } = action.payload;
            state.chatList = chatList;
        },
        setCurrentMessages(state, action) {
            const { currentMessages } = action.payload;
            state.currentMessages = currentMessages;
        },
        resetState(state) {
            Object.assign(state, initialState);
        },
    },
});

export const getChatList = (state) => state.messenger.chatList;
export const getCurrentMessages = (state) => state.messenger.currentMessages;

export const { setChatList, setCurrentMessages, resetState } =
    messengerSlice.actions;

export default messengerSlice.reducer;
