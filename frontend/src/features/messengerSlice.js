import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    friends: [],
    currentMessages: [],
};

const messengerSlice = createSlice({
    name: "messenger",
    initialState,
    reducers: {
        loadFriends(state, action) {
            const { friends } = action.payload;
            state.friends = friends;
        },
        resetState(state) {
            Object.assign(state, initialState);
        },
    },
});

export const getFriends = (state) => state.messenger.friends;

export const { loadFriends, resetState } = messengerSlice.actions;

export default messengerSlice.reducer;
