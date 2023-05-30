import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import { getAccessToken } from "../features/authSlice";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const accessToken = useSelector(getAccessToken);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            // This is the initial request, we know that the Authorization header was
            // not set so we are passing that in. Otherwise, if it is set and we got
            // 403 then the accessToken is expired
            (config) => {
                if (!config.headers["Authorization"]) {
                    console.log(
                        "Sending the access token with the request...",
                        accessToken
                    );
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            // If the response is good (meaning we got the users because
            // we have a valid access token) then just return the response
            (response) => response,
            // Otherwise when the response return an error; access token has expired
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // makes sure that we only request access token once
                    console.log("Prev token was invalid getting new token...");
                    const newAccessToken = await refresh();
                    console.log(
                        "Got the new token, sending the request again with new token: ",
                        newAccessToken
                    );
                    prevRequest.headers[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;

                    // At this point we are attempting to send our request again but with
                    // the new access token
                    return axiosPrivate(prevRequest);
                }
                // At this point, it means that not only the admin's access token is expired,
                // it also means that the admin's refresh token has expired
                return Promise.reject(error);
            }
        );

        return () => {
            // Removing interceptors
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
