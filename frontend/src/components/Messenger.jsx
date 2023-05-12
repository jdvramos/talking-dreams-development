import {
    Box,
    Grid,
    Stack,
    styled,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";

// FOR TESTING PURPOSES ONLY DELETE LATER
import {
    fakeMessagesKim,
    fakeMessagesLalo,
    fakeMessagesSaul,
} from "../fakedata/fakedata";

const SideBar = styled(Box)(({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: {
        display: "block",
        width: "60px",
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderRightWidth: "thin",
    },
}));

const MessengerContainer = styled(Stack)(({ theme }) => ({
    height: "100%",
    // backgroundColor and color for dark mode / light mode switch
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
}));

const ChatBoxGridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    borderRightWidth: "thin",
}));

const ChatInfoGridItem = styled(Grid)(({ theme }) => ({}));

const Messenger = ({ setMode }) => {
    const theme = useTheme();

    const mdBelow = useMediaQuery(theme.breakpoints.down("md"));

    const [showChatList, setShowChatList] = useState(true);

    const [currentFriend, setCurrentFriend] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);

    const handleSelectCurrentFriend = (friendInfo) => {
        setCurrentFriend(friendInfo);

        if (mdBelow) {
            setShowChatList(false);
        }
    };

    useEffect(() => {
        console.log(currentFriend);
        if (currentFriend) {
            if (currentFriend._id === "10") {
                setCurrentMessages(fakeMessagesSaul);
            } else if (currentFriend._id === "11") {
                setCurrentMessages(fakeMessagesKim);
            } else if (currentFriend._id === "12") {
                setCurrentMessages(fakeMessagesLalo);
            } else {
                setCurrentMessages([]);
            }
        }
    }, [currentFriend]);

    useEffect(() => {
        console.log(currentMessages);
    }, [currentMessages]);

    useEffect(() => {
        if (!showChatList && !mdBelow) {
            setShowChatList(true);
        }
    }, [mdBelow]);

    return (
        <MessengerContainer direction="row">
            <SideBar></SideBar>
            <ChatList
                handleSelectCurrentFriend={handleSelectCurrentFriend}
                setMode={setMode}
                mdBelow={mdBelow}
                showChatList={showChatList}
            ></ChatList>
            <Grid
                display={showChatList && mdBelow ? "none" : "flex"}
                flex={1}
                container
                height="100%"
            >
                <ChatBoxGridItem item xs={12} md={12} lg={8}>
                    <ChatBox
                        currentFriend={currentFriend}
                        mdBelow={mdBelow}
                        setShowChatList={setShowChatList}
                    />
                </ChatBoxGridItem>
                <ChatInfoGridItem item lg={4}></ChatInfoGridItem>
            </Grid>
        </MessengerContainer>
    );
};

export default Messenger;
