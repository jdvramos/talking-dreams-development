import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAccessToken } from "../features/authSlice";
import { accessPersistRoute } from "../features/authSlice";
import { Box, CircularProgress, styled } from "@mui/material";

const CenteredBox = styled(Box)(({ theme }) => ({
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const PersistLogin = () => {
    const accessToken = useSelector(getAccessToken);
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

    // For testing purposes only
    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(accessToken)}`);
    }, [isLoading]);

    return (
        <>
            {isLoading ? (
                <CenteredBox>
                    <CircularProgress />
                </CenteredBox>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;
