import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import messengerReducer from "../features/messengerSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        messenger: messengerReducer,
    },
});
