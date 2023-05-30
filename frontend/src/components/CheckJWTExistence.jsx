import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAccessToken, getUserInfo } from "../features/authSlice";
import { accessPersistRoute } from "../features/authSlice";
import Loading from "./Loading";

// We put CheckJWTExistence in between the Login and Register component to prevent an already logged in user from accessing the /login and /register routes. The functionality of CheckJWTExistence is the same as the PersistLogin component, it dispatches the accessPersistRoute which will verify if the 'jwt' that is in the user's cookie is valid, if it is valid then we will navigate the user to the main route ('/'), else, if the user has no such 'jwt' in his/her cookies, meaning he/she has not yet logged in, then we will render the Outlet which will be either the Login or Register component.

const CheckJWTExistence = () => {
    const accessToken = useSelector(getAccessToken);
    const userInfo = useSelector(getUserInfo);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await dispatch(accessPersistRoute()).unwrap();
            } catch (err) {
                console.log(err.status);
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        !accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : userInfo?.email ? (
                <Navigate to="/" />
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default CheckJWTExistence;
