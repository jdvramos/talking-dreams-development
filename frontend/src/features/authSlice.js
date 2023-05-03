import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

const initialState = {
    userInfo: null,
};

const LOGIN_URL = "/login";
const REGISTER_URL = "/register";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (email, pwd) => {
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (properFirstName, properLastName, email, pwd) => {
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({
                    firstName: properFirstName,
                    lastName: properLastName,
                    email,
                    pwd,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            });
    },
});

export default authSlice.reducer;
