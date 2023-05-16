import {
    Box,
    Avatar,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
    Stack,
    Button,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import shortenText from "../utils/shortenText";
import formatMessageTime from "../utils/formatMessageTime";

const FriendMain = styled(Box)(({ theme }) => ({
    width: "100%",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "5px",
}));

const ChatInfo = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: "10px",
    marginRight: "10px",
}));

const MessageStatus = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

const Friend = ({
    handleSelectCurrentFriend,
    friend,
    userId,
    currentFriend,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const isMedium = useMediaQuery(theme.breakpoints.only("md"));

    const {
        _id: friendId,
        firstName,
        lastName,
        userProfileImage,
    } = friend.friendInfo;

    const latestMessage = friend?.latestMessage;
    const messageType = friend?.latestMessage?.messageType;
    const messageLimit = isMedium ? 13 : 22;

    return (
        <FriendMain
            sx={{
                "&:hover": {
                    backgroundColor: isDarkMode ? "grey.800" : "grey.200",
                },
            }}
            onClick={() => handleSelectCurrentFriend(friend.friendInfo)}
            className={
                friendId === currentFriend?._id
                    ? isDarkMode
                        ? "active-dark"
                        : "active-light"
                    : ""
            }
        >
            <Avatar
                src={userProfileImage}
                alt={`${firstName} ${lastName}`}
                sx={{ width: "48px", height: "48px" }}
            />
            <ChatInfo flex={1}>
                <Typography
                    variant="body1"
                    component="h2"
                    fontWeight={
                        latestMessage?.status === "delivered" &&
                        latestMessage?.senderId !== userId
                            ? 800
                            : 400
                    }
                >
                    {`${firstName} ${lastName}`}
                </Typography>
                <Stack direction="row">
                    {messageType === "text" ? (
                        <Typography
                            variant="caption"
                            fontSize="0.85rem"
                            color={
                                latestMessage?.status === "delivered" &&
                                latestMessage?.senderId !== userId
                                    ? "text.primary"
                                    : "text.secondary"
                            }
                            fontWeight={
                                latestMessage?.status === "delivered" &&
                                latestMessage?.senderId !== userId
                                    ? 800
                                    : 400
                            }
                        >
                            {latestMessage?.senderId === friendId
                                ? shortenText(
                                      messageLimit,
                                      latestMessage?.content
                                  )
                                : `You: ${shortenText(
                                      messageLimit - 8,
                                      latestMessage?.content
                                  )}`}
                        </Typography>
                    ) : messageType === "image" ? (
                        <Typography
                            variant="caption"
                            fontSize="0.85rem"
                            fontWeight={
                                latestMessage?.status === "delivered" &&
                                latestMessage?.senderId !== userId
                                    ? 800
                                    : 400
                            }
                        >
                            {latestMessage?.senderId === friendId
                                ? shortenText(
                                      messageLimit,
                                      `${firstName} sent a photo`
                                  )
                                : "You sent a photo"}
                        </Typography>
                    ) : (
                        <Typography variant="caption" fontSize="0.85rem">
                            {shortenText(
                                messageLimit,
                                `${firstName} connected with you`
                            )}
                        </Typography>
                    )}
                    <Typography variant="caption" fontSize="0.85rem" px="3px">
                        •
                    </Typography>
                    <Typography
                        variant="caption"
                        fontSize="0.85rem"
                        fontWeight={
                            latestMessage?.status === "delivered" &&
                            latestMessage?.senderId !== userId
                                ? 800
                                : 400
                        }
                        color={
                            latestMessage?.status === "delivered" &&
                            latestMessage?.senderId !== userId
                                ? "text.primary"
                                : "text.secondary"
                        }
                    >
                        {formatMessageTime(latestMessage?.created_at)}
                    </Typography>
                </Stack>
            </ChatInfo>
            <MessageStatus>
                {latestMessage?.senderId === userId &&
                    latestMessage?.status === "delivered" && (
                        <CheckCircleIcon
                            sx={{ color: "grey.600", fontSize: "12px" }}
                        />
                    )}
                {latestMessage?.senderId === userId &&
                    latestMessage?.status === "seen" && (
                        <Avatar
                            src={userProfileImage}
                            alt={`${firstName} ${lastName}`}
                            sx={{ width: "14px", height: "14px" }}
                        />
                    )}
                {latestMessage?.senderId === friendId &&
                    latestMessage?.status === "delivered" && (
                        <CircleIcon color="primary" sx={{ fontSize: "12px" }} />
                    )}
                {latestMessage?.senderId === friendId &&
                    latestMessage?.status === "seen" && (
                        <CircleIcon
                            color="primary"
                            sx={{ fontSize: "12px", opacity: 0 }}
                        />
                    )}
            </MessageStatus>
        </FriendMain>
    );
};

export default Friend;
