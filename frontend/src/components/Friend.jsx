import {
    Box,
    Avatar,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
    Stack,
    Badge,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import shortenText from "../utils/shortenText";
import formatMessageTime from "../utils/formatMessageTime";
import { useEffect } from "react";

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

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.default}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

const Friend = ({
    handleSelectCurrentFriend,
    friend,
    userId,
    currentFriend,
    onlineFriends,
    smBelow,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const isMedium = useMediaQuery(theme.breakpoints.only("md"));
    const isSmall = useMediaQuery(theme.breakpoints.only("sm"));

    const {
        _id: friendId,
        firstName,
        lastName,
        userProfileImage,
    } = friend.friendInfo;

    const latestMessage = friend?.latestMessage;
    const messageType = friend?.latestMessage?.messageType;
    const messageLimit = isMedium ? 23 : isSmall ? 38 : smBelow ? 23 : 31;

    // useEffect(() => {
    //     console.log("isMedium,", isMedium);
    //     console.log("isSmall,", isSmall);
    //     console.log("smBelow,", smBelow);
    //     console.log("messageLimit", messageLimit);
    // }, [isMedium, isSmall, smBelow]);

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
            {onlineFriends &&
            onlineFriends.length > 0 &&
            onlineFriends.includes(friendId) ? (
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                >
                    <Avatar
                        src={userProfileImage}
                        alt={`${firstName} ${lastName}`}
                        sx={{ width: "48px", height: "48px" }}
                    />
                </StyledBadge>
            ) : (
                <Avatar
                    src={userProfileImage}
                    alt={`${firstName} ${lastName}`}
                    sx={{ width: "48px", height: "48px" }}
                />
            )}
            <ChatInfo flex={1}>
                <Typography
                    variant="body1"
                    component="h2"
                    fontWeight={
                        latestMessage?.status === "delivered" &&
                        latestMessage?.senderId !== userId
                            ? 700
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
                                    ? 700
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
                                    ? 700
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
                    <Typography
                        variant="caption"
                        fontSize="0.85rem"
                        px="3px"
                        sx={{ display: latestMessage ? "block" : "none" }}
                    >
                        •
                    </Typography>
                    <Typography
                        variant="caption"
                        fontSize="0.85rem"
                        fontWeight={
                            latestMessage?.status === "delivered" &&
                            latestMessage?.senderId !== userId
                                ? 700
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
                            sx={{ color: "grey.600", fontSize: "13px" }}
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
                        <CircleIcon
                            sx={{ color: "#1976d2", fontSize: "13px" }}
                        />
                    )}
                {latestMessage?.senderId === friendId &&
                    latestMessage?.status === "seen" && (
                        <CircleIcon
                            color="primary"
                            sx={{ fontSize: "13px", opacity: 0 }}
                        />
                    )}
            </MessageStatus>
        </FriendMain>
    );
};

export default Friend;
