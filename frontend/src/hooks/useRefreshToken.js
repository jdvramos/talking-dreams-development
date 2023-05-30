import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { updateAccessToken } from "../features/authSlice";

const useRefreshToken = () => {
    const REFRESH_URL = "/api/v1/refresh";
    const dispatch = useDispatch();

    const refresh = async () => {
        const response = await axios.get(REFRESH_URL, {
            withCredentials: true,
        });

        // Takes the previous state of logged in user and updates the access token
        dispatch(updateAccessToken({ accessToken: response.data.accessToken }));

        return response.data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
