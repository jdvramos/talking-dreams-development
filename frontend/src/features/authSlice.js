import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

const initialState = {
    userInfo: null,
};

const LOGIN_URL = "/api/v1/auth/login";
const REGISTER_URL = "/api/v1/auth/register";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (existingUserCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify(existingUserCredentials),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw rejectWithValue({
                status: error.response.status,
                message: error.response.data.msg,
            });
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (newUserCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify(newUserCredentials),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw rejectWithValue({
                status: error.response.status,
                message: error.response.data.msg,
            });
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
