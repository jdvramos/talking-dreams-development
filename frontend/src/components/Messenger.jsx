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
import ChatInfo from "./ChatInfo";
import ChatInfoDrawer from "./ChatInfoDrawer";
import { useEffect, useRef, useState } from "react";

// FOR TESTING PURPOSES ONLY DELETE LATER
import {
    fakeMessagesKim,
    fakeMessagesLalo,
    fakeMessagesSaul,
    userId,
    fakeActiveUsers,
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
    height: "100%",
}));

const ChatInfoGridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    height: "100%",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    borderLeftWidth: "thin",
}));

const Messenger = ({ setMode }) => {
    const scrollRef = useRef();

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const mdBelow = useMediaQuery(theme.breakpoints.down("md"));
    const lgAbove = useMediaQuery(theme.breakpoints.up("lg"));
    const xlAbove = useMediaQuery(theme.breakpoints.up("xl"));
    const mdOnly = useMediaQuery(theme.breakpoints.only("md"));

    const [showChatList, setShowChatList] = useState(true);

    const [message, setMessage] = useState("");

    const [currentFriend, setCurrentFriend] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);

    const [chatInfoOpen, setChatInfoOpen] = useState(false);

    const handleSelectCurrentFriend = (friendInfo) => {
        setCurrentFriend(friendInfo);

        if (mdBelow) {
            setShowChatList(false);
        }
    };

    useEffect(() => {
        console.log("chatInfoOpen: ", chatInfoOpen);
    }, [chatInfoOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView();
    }, [currentMessages]);

    useEffect(() => {
        console.log("lgAbove", lgAbove);
    }, [lgAbove]);

    useEffect(() => {
        console.log("mdBelow", mdBelow);
    }, [mdBelow]);

    const goBackToChatList = () => {
        setShowChatList(true);
        setCurrentFriend(null);
        setCurrentMessages([]);
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
        if (currentFriend) {
            setMessage("");
            // setChatInfoOpen(true);
        }
        if (currentFriend === null) {
            setChatInfoOpen(false);
        }
    }, [currentFriend]);

    useEffect(() => {
        console.log(currentMessages);
    }, [currentMessages]);

    useEffect(() => {
        if (!showChatList && !mdBelow) {
            setShowChatList(true);
        }

        if (currentFriend && mdBelow) {
            setCurrentFriend(null);
            setCurrentMessages([]);
        }
    }, [mdBelow]);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const addEmoji = (emoji) => {
        setMessage(`${message}` + emoji);
    };

    return (
        <MessengerContainer direction="row">
            <SideBar></SideBar>
            <ChatList
                handleSelectCurrentFriend={handleSelectCurrentFriend}
                setMode={setMode}
                isDarkMode={isDarkMode}
                mdBelow={mdBelow}
                showChatList={showChatList}
                currentFriend={currentFriend}
                fakeActiveUsers={fakeActiveUsers}
            ></ChatList>
            <Grid
                display={showChatList && mdBelow ? "none" : "flex"}
                flex={1}
                container
                height="100%"
            >
                <ChatBoxGridItem
                    item
                    xs={chatInfoOpen && mdBelow ? 0 : 12}
                    md={12}
                    lg={chatInfoOpen && lgAbove ? 8 : 12}
                >
                    <ChatBox
                        currentFriend={currentFriend}
                        currentMessages={currentMessages}
                        mdBelow={mdBelow}
                        isDarkMode={isDarkMode}
                        goBackToChatList={goBackToChatList}
                        userId={userId}
                        handleMessageChange={handleMessageChange}
                        message={message}
                        addEmoji={addEmoji}
                        fakeActiveUsers={fakeActiveUsers}
                        setChatInfoOpen={setChatInfoOpen}
                        scrollRef={scrollRef}
                    />
                </ChatBoxGridItem>
                {/* <ChatBoxGridItem
                    item
                    xs={chatInfoOpen && mdBelow ? 0 : 12}
                    md={chatInfoOpen && mdOnly ? null : 12}
                    lg={chatInfoOpen && lgAbove ? 8 : 12}
                >
                    <ChatBox
                        currentFriend={currentFriend}
                        currentMessages={currentMessages}
                        mdBelow={mdBelow}
                        isDarkMode={isDarkMode}
                        goBackToChatList={goBackToChatList}
                        userId={userId}
                        handleMessageChange={handleMessageChange}
                        message={message}
                        addEmoji={addEmoji}
                        fakeActiveUsers={fakeActiveUsers}
                        setChatInfoOpen={setChatInfoOpen}
                        scrollRef={scrollRef}
                    />
                </ChatBoxGridItem> */}
                {/* {chatInfoOpen && lgAbove && (
                    <ChatInfoGridItem item lg={4}>
                        <ChatInfo
                            currentFriend={currentFriend}
                            currentMessages={currentMessages}
                            isDarkMode={isDarkMode}
                            xlAbove={xlAbove}
                        />
                    </ChatInfoGridItem>
                )} */}
                {chatInfoOpen && (
                    <>
                        {lgAbove && (
                            <ChatInfoGridItem item lg={4}>
                                <ChatInfo
                                    currentFriend={currentFriend}
                                    currentMessages={currentMessages}
                                    isDarkMode={isDarkMode}
                                    xlAbove={xlAbove}
                                />
                            </ChatInfoGridItem>
                        )}
                        {mdOnly && (
                            <ChatInfoDrawer
                                currentFriend={currentFriend}
                                currentMessages={currentMessages}
                                isDarkMode={isDarkMode}
                                xlAbove={xlAbove}
                                chatInfoOpen={chatInfoOpen}
                                setChatInfoOpen={setChatInfoOpen}
                            />
                        )}
                        {mdBelow && (
                            <ChatInfoGridItem item xs={12}>
                                <ChatInfo
                                    currentFriend={currentFriend}
                                    currentMessages={currentMessages}
                                    isDarkMode={isDarkMode}
                                    xlAbove={xlAbove}
                                />
                            </ChatInfoGridItem>
                        )}
                    </>
                )}
            </Grid>
        </MessengerContainer>
    );
};

export default Messenger;
