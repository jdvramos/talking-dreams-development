import {
    Box,
    Grid,
    Stack,
    styled,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ChatList from "./ChatList";
import { useState } from "react";

const SideBar = styled(Box)(({ theme }) => ({
    display: "none",
    backgroundColor: "black",
    [theme.breakpoints.up("md")]: {
        display: "block",
        width: "60px",
    },
}));

const MessengerContainer = styled(Stack)(({ theme }) => ({
    height: "100%",
    // backgroundColor and color for dark mode / light mode switch
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
}));

const ChatBox = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.error.light,
    display: "flex",
    flexDirection: "column",
}));

const ChatInfo = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.warning.light,
}));

const Messenger = ({ setMode }) => {
    const theme = useTheme();
    const mdBelow = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <MessengerContainer direction="row">
            <SideBar></SideBar>
            <ChatList setMode={setMode} mdBelow={mdBelow}></ChatList>
            <Grid flex={1} container height="100%">
                <ChatBox item xs={12} sm={12} md={12} lg={8}></ChatBox>
                <ChatInfo item xs={0} sm={0} md={0} lg={4}></ChatInfo>
            </Grid>
        </MessengerContainer>
    );
};

export default Messenger;
