import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Snackbar,
    Stack,
    TextField,
    Typography,
    styled,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ChatInfo from "./ChatInfo";
import ChatInfoDrawerMdOnly from "./ChatInfoDrawerMdOnly";
import ChatInfoDrawerMdBelow from "./ChatInfoDrawerMdBelow";
import { useEffect, useRef, useState } from "react";

// FOR TESTING PURPOSES ONLY DELETE LATER
import {
    fakeMessagesKim,
    fakeMessagesLalo,
    fakeMessagesSaul,
    userId,
    fakeActiveUsers,
} from "../fakedata/fakedata";
import { fakeFriends } from "../fakedata/fakedata";

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

const AddFriendDialog = styled(Dialog)(({ theme }) => ({}));

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
            <SideBar></SideBar>
            <ChatList
                handleSelectCurrentFriend={handleSelectCurrentFriend}
                setMode={setMode}
                isDarkMode={isDarkMode}
                mdBelow={mdBelow}
                showChatList={showChatList}
                currentFriend={currentFriend}
                fakeActiveUsers={fakeActiveUsers}
                setAddFriendDialogOpen={setAddFriendDialogOpen}
            />
            <Grid
                display={showChatList && mdBelow ? "none" : "flex"}
                flex={1}
                container
                height="100%"
            >
                <ChatBoxGridItem
                    item
                    xs={12}
                    md={12}
                    lg={chatInfoState.chatInfoOpen && lgAbove ? 8 : 12}
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
            <AddFriendDialog
                open={addFriendDialogOpen}
                onClose={() => setAddFriendDialogOpen(false)}
                fullWidth
            >
                <DialogTitle id="dialog-title">Add a friend</DialogTitle>
                <DialogContent>
                    <Typography>Please enter a name:</Typography>
                    <Autocomplete
                        size="small"
                        options={fakeFriends}
                        onChange={(_event, newValue) =>
                            setFriendToAdd(newValue)
                        }
                        getOptionLabel={(option) =>
                            `${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`
                        }
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <Avatar
                                    src={option?.friendInfo?.userProfileImage}
                                    alt={`${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`}
                                    sx={{
                                        marginRight: "15px",
                                        width: "50px",
                                        height: "50px",
                                    }}
                                />
                                <Stack>
                                    <Typography
                                        fontWeight={500}
                                    >{`${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`}</Typography>
                                    <Typography variant="caption">
                                        {option?.friendInfo?.email}
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                            />
                        )}
                    ></Autocomplete>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddFriendDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddFriend} autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </AddFriendDialog>
            <Snackbar
                open={friendRequestSent}
                onClose={() => setFriendRequestSent(false)}
                message="Friend request sent successfully!"
                autoHideDuration={4000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            ></Snackbar>
        </MessengerContainer>
    );
};

export default Messenger;
