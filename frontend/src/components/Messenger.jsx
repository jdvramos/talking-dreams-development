import { Grid, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ChatInfo from "./ChatInfo";
import AddFriendDialog from "./AddFriendDialog";
import FriendRequestSentSnackbar from "./FriendRequestSentSnackbar";
import InvalidImageSnackbar from "./InvalidImageSnackbar";
import ChatInfoDrawerMdOnly from "./ChatInfoDrawerMdOnly";
import ChatInfoDrawerMdBelow from "./ChatInfoDrawerMdBelow";
import ViewFriendsDialog from "./ViewFriendsDialog";
import { useNavigate } from "react-router-dom";
import {
    getUserInfo,
    getUserProfileImage,
    logoutUser,
    uploadImageToCloudinary,
} from "../features/authSlice";
import {
    getChatList,
    setChatList,
    getCurrentFriend,
    setCurrentFriend,
    getCurrentMessages,
    setCurrentMessages,
    getOnlineFriends,
    setOnlineFriends,
    getCurrentFriendIsTypingInfo,
    setCurrentFriendIsTypingInfo,
    getMessageSent,
    setMessageSentToTrue,
    setMessageSentToFalse,
    getSocketMessage,
    setSocketMessage,
    getPreferredTheme,
    setPreferredTheme,
    insertSocketMessageToCurrentMessages,
    updateLatestMessageOnChatList,
    updateLatestMessageStatusOnChatList,
    updateLastMessageToSeenOnCurrentMessages,
} from "../features/messengerSlice";
import { resetAllState } from "../features/resetAllState";
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

const Messenger = () => {
    const GET_CHATLIST_URL = "/api/v1/messenger/get-chatlist";
    const GET_CURRENT_MESSAGES_URL = "/api/v1/messenger/get-current-messages";
    const SEND_MESSAGE_URL = "/api/v1/messenger/send-message";
    const UPDATE_TO_SEEN_URL = "/api/v1/messenger/update-to-seen";
    const GET_PREFERRED_THEME_URL = "/api/v1/messenger/get-theme";
    const SET_PREFERRED_THEME_URL = "/api/v1/messenger/set-theme";

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
    const currentFriendIsTypingInfo = useSelector(getCurrentFriendIsTypingInfo);
    const messageSent = useSelector(getMessageSent);
    const socketMessage = useSelector(getSocketMessage);
    const preferredTheme = useSelector(getPreferredTheme);

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

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [validImage, setValidImage] = useState(false);
    const [showUploadError, setShowUploadError] = useState(false);

    const [friendIsTyping, setFriendIsTyping] = useState(null);

    const [isInitialMount, setIsInitialMount] = useState(true);

    const [chatInfoState, setChatInfoState] = useState({
        chatInfoOpen: false,
        chatInfoDrawerOpen: false,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            setValidImage(false);
            setShowUploadError(true);
            return;
        }

        setImage(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImagePreview(reader.result);
        };

        setValidImage(true);
    };

    const handleDeleteImagePreview = () => {
        setImage(null);
        setImagePreview(null);
        setValidImage(false);
        setShowUploadError(false);
    };

    const changeInfoState = () => {
        setChatInfoState({
            chatInfoOpen: true,
            chatInfoDrawerOpen: false,
        });
        setIsInitialMount(false);
    };

    useEffect(() => {
        if (isInitialMount && currentFriend) {
            changeInfoState();
        }
    }, [isInitialMount, currentFriend]);

    useEffect(() => {
        const getPreferredTheme = async () => {
            const storedTheme = localStorage.getItem("preferredTheme");

            if (storedTheme) {
                dispatch(setPreferredTheme({ preferredTheme: storedTheme }));
            } else {
                try {
                    const response = await axiosPrivate.get(
                        GET_PREFERRED_THEME_URL
                    );

                    const apiPreferredTheme = response.data.preferredTheme;
                    dispatch(
                        setPreferredTheme({ preferredTheme: apiPreferredTheme })
                    );
                    localStorage.setItem("preferredTheme", apiPreferredTheme);
                } catch (error) {
                    await dispatch(logoutUser());
                    dispatch(resetAllState());
                    navigate("/login");
                }
            }
        };

        getPreferredTheme();
    }, []);

    const dispatchSetPreferredTheme = async (theme) => {
        try {
            await axiosPrivate.patch(
                SET_PREFERRED_THEME_URL,
                JSON.stringify({ preferredTheme: theme })
            );
            dispatch(setPreferredTheme({ preferredTheme: theme }));
            localStorage.setItem("preferredTheme", theme);
        } catch (err) {
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        socket.current = io("ws://localhost:8001");
        // socket.current = io("ws://192.168.1.11:8001");

        socket.current.on("receiveMessage", (message) => {
            dispatch(setSocketMessage({ socketMessage: message }));
        });

        socket.current.on("friendIsTypingResponse", (typingInfo) => {
            setFriendIsTyping(typingInfo);
        });

        socket.current.on(
            "messageSeenByFriendResponse",
            (seenSocketMessage) => {
                dispatch(
                    updateLatestMessageStatusOnChatList({
                        latestMessage: seenSocketMessage,
                    })
                );

                dispatch(updateLastMessageToSeenOnCurrentMessages());
            }
        );

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
        if (friendIsTyping && friendIsTyping.senderId === currentFriend?._id) {
            dispatch(
                setCurrentFriendIsTypingInfo({ typingInfo: friendIsTyping })
            );
        }
    }, [friendIsTyping]);

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
            await dispatch(logoutUser());
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
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        if (currentFriend) {
            dispatchSetCurrentMessages(currentFriend?._id);
        }
    }, [currentFriend]);

    const sendMessage = async () => {
        try {
            const senderName = `${userInfo?.firstName} ${userInfo?.lastName}`;
            const response = await axiosPrivate.post(
                SEND_MESSAGE_URL,
                JSON.stringify({
                    messageType: "text",
                    content: message || "👍",
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
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    const sendImage = async () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dkkcgnkep");

        try {
            const imageSent = await dispatch(
                uploadImageToCloudinary({ data })
            ).unwrap();

            const senderName = `${userInfo?.firstName} ${userInfo?.lastName}`;

            const response = await axiosPrivate.post(
                SEND_MESSAGE_URL,
                JSON.stringify({
                    messageType: "image",
                    content: imageSent,
                    senderId: userInfo?.id,
                    senderName,
                    receiverId: currentFriend?._id,
                })
            );

            dispatch(
                setMessageSentToTrue({ messageSent: response.data.messageSent })
            );

            setImage(null);
            setImagePreview(null);
            setValidImage(false);
            setShowUploadError(false);
        } catch (error) {
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    const updateMessageStatusToSeen = async (socketMessage) => {
        try {
            await axiosPrivate.patch(
                UPDATE_TO_SEEN_URL,
                JSON.stringify({ message: socketMessage })
            );
        } catch {
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        if (
            currentFriend &&
            currentMessages.length > 0 &&
            currentMessages[currentMessages.length - 1].senderId ===
                currentFriend?._id &&
            currentMessages[currentMessages.length - 1].status !== "seen"
        ) {
            const lastMessageOnCurrentMessages =
                currentMessages[currentMessages.length - 1];

            updateMessageStatusToSeen(lastMessageOnCurrentMessages);

            const updatedToSeen = {
                ...lastMessageOnCurrentMessages,
                status: "seen",
            };

            dispatch(
                updateLatestMessageStatusOnChatList({
                    latestMessage: updatedToSeen,
                })
            );

            dispatch(updateLastMessageToSeenOnCurrentMessages());

            socket.current.emit("messageSeenByFriend", updatedToSeen);
        }
    }, [currentMessages]);

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
        if (
            socketMessage &&
            currentFriend &&
            socketMessage.senderId === currentFriend?._id &&
            socketMessage.receiverId === userInfo?.id
        ) {
            console.log("The socket message: ", socketMessage);

            dispatch(insertSocketMessageToCurrentMessages({ socketMessage }));

            // Async call
            updateMessageStatusToSeen(socketMessage);

            const seenSocketMessage = {
                ...socketMessage,
                status: "seen",
            };

            socket.current.emit("messageSeenByFriend", seenSocketMessage);

            dispatch(
                updateLatestMessageStatusOnChatList({
                    latestMessage: seenSocketMessage,
                })
            );
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
    }, [currentMessages, currentFriendIsTypingInfo]);

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

    useEffect(() => {
        if (message) {
            socket.current.emit("friendIsTyping", {
                senderId: userInfo?.id,
                receiverId: currentFriend?._id,
            });
        }
    }, [message]);

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
                preferredTheme={preferredTheme}
                dispatchSetPreferredTheme={dispatchSetPreferredTheme}
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
                        currentFriendIsTypingInfo={currentFriendIsTypingInfo}
                        handleImageChange={handleImageChange}
                        imagePreview={imagePreview}
                        validImage={validImage}
                        handleDeleteImagePreview={handleDeleteImagePreview}
                        sendImage={sendImage}
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
            <InvalidImageSnackbar
                showUploadError={showUploadError}
                setShowUploadError={setShowUploadError}
            />
        </MessengerContainer>
    );
};

export default Messenger;
