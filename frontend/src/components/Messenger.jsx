import { Grid, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ChatInfo from "./ChatInfo";
import AddFriendDialog from "./AddFriendDialog";
import FriendRequestSentSnackbar from "./FriendRequestSentSnackbar";
import ChatInfoDrawerMdOnly from "./ChatInfoDrawerMdOnly";
import ChatInfoDrawerMdBelow from "./ChatInfoDrawerMdBelow";
import ViewFriendsDialog from "./ViewFriendsDialog";
import { useEffect, useRef, useState } from "react";

// FOR TESTING PURPOSES ONLY DELETE LATER
import {
    fakeMessagesKim,
    fakeMessagesLalo,
    fakeMessagesSaul,
    fakeActiveUsers,
    fakeUser,
    fakeFriendRequestSent,
    fakeFriendRequestReceived,
} from "../fakedata/fakedata";
import { fakeFriends } from "../fakedata/fakedata";

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

    const [friendToAdd, setFriendToAdd] = useState("");
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const [showChatList, setShowChatList] = useState(true);

    const [message, setMessage] = useState("");

    const [currentFriend, setCurrentFriend] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);

    const [chatInfoState, setChatInfoState] = useState({
        chatInfoOpen: false,
        chatInfoDrawerOpen: false,
    });

    const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
    const [viewFriendsDialogOpen, setViewFriendsDialogOpen] = useState(false);

    const handleSelectCurrentFriend = (friendInfo) => {
        setCurrentFriend(friendInfo);

        if (mdBelow) {
            setShowChatList(false);
        }
    };

    useEffect(() => {
        console.log("chatInfoOpen: ", chatInfoState.chatInfoOpen);
        console.log("chatInfoDrawerOpen: ", chatInfoState.chatInfoDrawerOpen);
    }, [chatInfoState]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView();
    }, [currentMessages]);

    useEffect(() => {
        console.log("lgAbove", lgAbove);
    }, [lgAbove]);

    useEffect(() => {
        setChatInfoState((prev) => ({
            chatInfoOpen: prev.chatInfoOpen,
            chatInfoDrawerOpen: false,
        }));
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
        }
        if (currentFriend === null) {
            setChatInfoState({
                chatInfoOpen: false,
                chatInfoDrawerOpen: false,
            });
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

    const handleAddFriend = () => {
        console.log(friendToAdd);
        setAddFriendDialogOpen(false);
        setFriendRequestSent(true);
    };

    return (
        <MessengerContainer direction="row">
            <Sidebar
                fakeUser={fakeUser}
                mdBelow={mdBelow}
                setViewFriendsDialogOpen={setViewFriendsDialogOpen}
            />
            <ChatList
                handleSelectCurrentFriend={handleSelectCurrentFriend}
                setMode={setMode}
                isDarkMode={isDarkMode}
                mdBelow={mdBelow}
                showChatList={showChatList}
                currentFriend={currentFriend}
                fakeActiveUsers={fakeActiveUsers}
                setAddFriendDialogOpen={setAddFriendDialogOpen}
                setViewFriendsDialogOpen={setViewFriendsDialogOpen}
            />
            <Grid
                display={showChatList && mdBelow ? "none" : "flex"}
                flex={1}
                container
                height="100%"
            >
                <ChatBoxGridItem
                    item
                    xs={12} // <- includes sm
                    md={12}
                    lg={chatInfoState.chatInfoOpen && lgAbove ? 8 : 12}
                >
                    <ChatBox
                        currentFriend={currentFriend}
                        currentMessages={currentMessages}
                        mdBelow={mdBelow}
                        isDarkMode={isDarkMode}
                        goBackToChatList={goBackToChatList}
                        userId={fakeUser._id}
                        handleMessageChange={handleMessageChange}
                        message={message}
                        addEmoji={addEmoji}
                        fakeActiveUsers={fakeActiveUsers}
                        setChatInfoState={setChatInfoState}
                        scrollRef={scrollRef}
                    />
                </ChatBoxGridItem>
                {chatInfoState.chatInfoOpen && lgAbove && (
                    <ChatInfoGridItem item lg={4}>
                        <ChatInfo
                            currentFriend={currentFriend}
                            currentMessages={currentMessages}
                            isDarkMode={isDarkMode}
                            xlAbove={xlAbove}
                        />
                    </ChatInfoGridItem>
                )}
                {chatInfoState.chatInfoDrawerOpen && mdOnly && (
                    <ChatInfoDrawerMdOnly
                        currentFriend={currentFriend}
                        currentMessages={currentMessages}
                        isDarkMode={isDarkMode}
                        xlAbove={xlAbove}
                        chatInfoState={chatInfoState}
                    />
                )}
                {chatInfoState.chatInfoDrawerOpen && mdBelow && (
                    <ChatInfoDrawerMdBelow
                        currentFriend={currentFriend}
                        currentMessages={currentMessages}
                        isDarkMode={isDarkMode}
                        xlAbove={xlAbove}
                        chatInfoState={chatInfoState}
                    />
                )}
            </Grid>
            {/* modals and alerts */}
            <AddFriendDialog
                fakeFriends={fakeFriends}
                addFriendDialogOpen={addFriendDialogOpen}
                setAddFriendDialogOpen={setAddFriendDialogOpen}
                setFriendToAdd={setFriendToAdd}
                handleAddFriend={handleAddFriend}
            />
            <ViewFriendsDialog
                fakeFriendRequestSent={fakeFriendRequestSent}
                fakeFriendRequestReceived={fakeFriendRequestReceived}
                viewFriendsDialogOpen={viewFriendsDialogOpen}
                setViewFriendsDialogOpen={setViewFriendsDialogOpen}
                isDarkMode={isDarkMode}
            />
            <FriendRequestSentSnackbar
                friendRequestSent={friendRequestSent}
                setFriendRequestSent={setFriendRequestSent}
            />
        </MessengerContainer>
    );
};

export default Messenger;
