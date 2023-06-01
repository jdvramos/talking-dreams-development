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
import { useNavigate } from "react-router-dom";
import {
    getUserInfo,
    getUserProfileImage,
    logoutUser,
} from "../features/authSlice";
import { resetAllState } from "../features/resetAllState";
import {
    getChatList,
    setChatList,
    getCurrentFriend,
    setCurrentFriend,
    getCurrentMessages,
    setCurrentMessages,
    getOnlineFriends,
    setOnlineFriends,
    getMessageSent,
    setMessageSentToTrue,
    setMessageSentToFalse,
    getSocketMessage,
    setSocketMessage,
    insertSocketMessageToCurrentMessages,
    updateLatestMessageOnChatList,
    updateLatestMessageStatusOnChatList,
} from "../features/messengerSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";

// FOR TESTING PURPOSES ONLY DELETE LATER
import {
    fakeFriends,
    fakeFriendRequestSent,
    fakeFriendRequestReceived,
} from "../fakedata/fakedata";

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
    const GET_CHATLIST_URL = "/api/v1/messenger/get-chatlist";
    const GET_CURRENT_MESSAGES_URL = "/api/v1/messenger/get-current-messages";
    const SEND_MESSAGE_URL = "/api/v1/messenger/send-message";

    const scrollRef = useRef();
    const socket = useRef();

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userInfo = useSelector(getUserInfo);
    const userProfileImage = useSelector(getUserProfileImage);

    const chatList = useSelector(getChatList);
    const currentFriend = useSelector(getCurrentFriend);
    const currentMessages = useSelector(getCurrentMessages);
    const onlineFriends = useSelector(getOnlineFriends);
    const messageSent = useSelector(getMessageSent);
    const socketMessage = useSelector(getSocketMessage);

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
    // const [socketMessage, setSocketMessage] = useState("");

    const [chatInfoState, setChatInfoState] = useState({
        chatInfoOpen: false,
        chatInfoDrawerOpen: false,
    });

    useEffect(() => {
        socket.current = io("ws://localhost:8001");

        socket.current.on("receiveMessage", (message) => {
            dispatch(setSocketMessage({ socketMessage: message }));
        });

        socket.current.on("getAllOnlineUsers", (onlineUsers) => {
            const onlineFriendsList = onlineUsers
                .filter((user) => user.userInfo.id !== userInfo?.id)
                .filter((user) => user.userInfo.friends.includes(userInfo?.id))
                .map((user) => user.userInfo.id);

            console.log("onlineFriends: ", onlineFriendsList);

            dispatch(setOnlineFriends({ onlineFriends: onlineFriendsList }));
        });
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", userInfo.id, userInfo);
    }, []);

    const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
    const [viewFriendsDialogOpen, setViewFriendsDialogOpen] = useState(false);

    const handleSelectCurrentFriend = (friendInfo) => {
        dispatch(setCurrentFriend({ currentFriend: friendInfo }));

        if (mdBelow) {
            setShowChatList(false);
        }
    };

    const dispatchSetChatList = async () => {
        try {
            const response = await axiosPrivate.get(GET_CHATLIST_URL);
            dispatch(setChatList({ chatList: response.data.chatList }));
        } catch (err) {
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        dispatchSetChatList();
    }, []);

    const dispatchSetCurrentMessages = async (friendId) => {
        try {
            const response = await axiosPrivate.get(
                `${GET_CURRENT_MESSAGES_URL}/${friendId}`
            );
            dispatch(
                setCurrentMessages({
                    currentMessages: response.data.currentMessages,
                })
            );
        } catch (error) {
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        if (currentFriend) {
            dispatchSetCurrentMessages(currentFriend?._id);
        }
    }, [currentFriend]);

    const sendMessage = async (messageType) => {
        try {
            const senderName = `${userInfo?.firstName} ${userInfo?.lastName}`;
            const response = await axiosPrivate.post(
                SEND_MESSAGE_URL,
                JSON.stringify({
                    messageType,
                    content: message,
                    senderId: userInfo?.id,
                    senderName,
                    receiverId: currentFriend?._id,
                })
            );

            dispatch(
                setMessageSentToTrue({ messageSent: response.data.messageSent })
            );

            setMessage("");
        } catch (error) {
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        if (messageSent) {
            socket.current.emit(
                "sendMessage",
                currentMessages[currentMessages.length - 1]
            );

            dispatch(
                updateLatestMessageOnChatList({
                    latestMessage: currentMessages[currentMessages.length - 1],
                })
            );

            dispatch(setMessageSentToFalse());
        }
    }, [messageSent]);

    useEffect(() => {
        if (socketMessage && currentFriend) {
            if (
                socketMessage.senderId === currentFriend?._id &&
                socketMessage.receiverId === userInfo?.id
            ) {
                console.log("The socket message: ", socketMessage);

                dispatch(
                    insertSocketMessageToCurrentMessages({ socketMessage })
                );

                // Async call
                // dispatch(updateStatusToSeen({ socketMessage }))

                // socket.current.emit("messageSeen", socketMessage);

                // At the beginning, we dispatch this UPDATE_FRIEND_MESSAGE action when the logged in user sends a new message to the currentFriend, now we also want to dispatch this action when the logged in user receives a new message from the currentFriend.

                const seenSocketMessage = {
                    ...socketMessage,
                    status: "seen",
                };

                dispatch(
                    updateLatestMessageStatusOnChatList({
                        latestMessage: seenSocketMessage,
                    })
                );
            }
        }

        dispatch(setSocketMessage({ socketMessage: "" }));
    }, [socketMessage]);

    useEffect(() => {
        if (
            socketMessage &&
            socketMessage.senderId !== currentFriend?._id &&
            socketMessage.receiverId === userInfo?.id
        ) {
            // Add an alert when new message comes or notification sound

            dispatch(
                updateLatestMessageStatusOnChatList({
                    latestMessage: socketMessage,
                })
            );
        }
    }, [socketMessage]);

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
        dispatch(setCurrentFriend({ currentFriend: null }));
        dispatch(
            setCurrentMessages({
                currentMessages: [],
            })
        );
    };

    useEffect(() => {
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
            dispatch(setCurrentFriend({ currentFriend: null }));
            dispatch(
                setCurrentMessages({
                    currentMessages: [],
                })
            );
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

    const handleLogout = async () => {
        await dispatch(logoutUser());
        socket.current.emit("logout", userInfo.id);
        dispatch(resetAllState());
        navigate("/login");
    };

    return (
        <MessengerContainer direction="row">
            <Sidebar
                userInfo={userInfo}
                userProfileImage={userProfileImage}
                mdBelow={mdBelow}
                handleLogout={handleLogout}
                setViewFriendsDialogOpen={setViewFriendsDialogOpen}
            />
            <ChatList
                userId={userInfo.id}
                chatList={chatList}
                handleSelectCurrentFriend={handleSelectCurrentFriend}
                setMode={setMode}
                isDarkMode={isDarkMode}
                mdBelow={mdBelow}
                showChatList={showChatList}
                currentFriend={currentFriend}
                onlineFriends={onlineFriends}
                handleLogout={handleLogout}
                setAddFriendDialogOpen={setAddFriendDialogOpen}
                setViewFriendsDialogOpen={setViewFriendsDialogOpen}
                dispatchSetChatList={dispatchSetChatList}
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
                        userId={userInfo.id}
                        handleMessageChange={handleMessageChange}
                        message={message}
                        addEmoji={addEmoji}
                        sendMessage={sendMessage}
                        onlineFriends={onlineFriends}
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
