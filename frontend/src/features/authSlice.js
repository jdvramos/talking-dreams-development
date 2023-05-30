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
const LOGOUT_URL = "/api/v1/auth/logout";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkkcgnkep/image/upload";
const PERSIST_URL = "/api/v1/persist";

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

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(LOGOUT_URL, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw rejectWithValue({
                status: error.response.status,
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

export const accessPersistRoute = createAsyncThunk(
    "auth/accessPersistRoute",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(PERSIST_URL, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw rejectWithValue({
                status: error.response.status,
            });
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAccessToken(state, action) {
            const { accessToken } = action.payload;
            state.accessToken = accessToken;
        },
        resetState(state) {
            Object.assign(state, initialState);
        },
    },
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
            })
            .addCase(accessPersistRoute.fulfilled, (state, action) => {
                state.userInfo = action.payload.userInfo;
                state.accessToken = action.payload.accessToken;
                state.userProfileImage = action.payload.userProfileImage;
            });
    },
});

export const getUserInfo = (state) => state.auth.userInfo;
export const getAccessToken = (state) => state.auth.accessToken;
export const getUserProfileImage = (state) => state.auth.getUserProfileImage;

export const { updateAccessToken, resetState } = authSlice.actions;

export default authSlice.reducer;
