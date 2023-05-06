import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import axiosMain from "axios";

const initialState = {
    userInfo: {},
    accessToken: "",
    userProfileImage: "",
};

const LOGIN_URL = "/api/v1/auth/login";
const REGISTER_URL = "/api/v1/auth/register";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkkcgnkep/image/upload";

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

export const uploadImageToCloudinary = createAsyncThunk(
    "auth/uploadImageToCloudinary",
    async (imageData, { rejectWithValue }) => {
        const { data } = imageData;
        try {
            const response = await axiosMain.post(CLOUDINARY_URL, data);
            console.log(response);
            return response.data.secure_url.toString();
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
                state.userInfo = action.payload.userInfo;
                state.accessToken = action.payload.accessToken;
                state.userProfileImage = action.payload.userProfileImage;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userInfo = action.payload.userInfo;
                state.accessToken = action.payload.accessToken;
                state.userProfileImage = action.payload.userProfileImage;
            });
    },
});

export default authSlice.reducer;
