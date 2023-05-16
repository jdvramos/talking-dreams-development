import { Avatar, Box, Stack, Typography, styled } from "@mui/material";
import formatMessageTime from "../utils/formatMessageTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MessagesMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "7px 0",
    gap: "20px",
}));

const YourMessage = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
    maxWidth: "70%",
}));

const FriendMessage = styled(Box)(({ theme }) => ({
    display: "flex",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: "10px",
    maxWidth: "70%",
}));

const MessageBubble = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    color: "#fff",
    borderRadius: "15px",
}));

const Messages = ({ currentMessages, userId, currentFriend, isDarkMode }) => {
    return (
        <>
            {currentMessages && currentMessages.length > 0 && (
                <MessagesMain>
                    {currentMessages.map((message, index) =>
                        message.senderId === userId ? (
                            <YourMessage
                                key={message._id}
                                mr={
                                    index === currentMessages.length - 1
                                        ? 0
                                        : "20px"
                                }
                            >
                                <Stack direction="row" alignItems="flex-end">
                                    <MessageBubble bgcolor="#1976d2">
                                        {message.messageType === "text" ? (
                                            <Typography variant="body2">
                                                {message.content}
                                            </Typography>
                                        ) : (
                                            <img
                                                style={{ width: "100%" }}
                                                src={message.content}
                                                alt={message.content}
                                            />
                                        )}
                                    </MessageBubble>
                                    {index === currentMessages.length - 1 &&
                                    message.senderId === userId &&
                                    message.status === "seen" ? (
                                        <Avatar
                                            src={
                                                currentFriend?.userProfileImage
                                            }
                                            alt={`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                                            sx={{
                                                width: "14px",
                                                height: "14px",
                                                marginLeft: "4px",
                                                marginRight: "4px",
                                            }}
                                        />
                                    ) : index === currentMessages.length - 1 &&
                                      message.senderId === userId &&
                                      message.status === "delivered" ? (
                                        <CheckCircleIcon
                                            sx={{
                                                color: "grey.600",
                                                fontSize: "12px",
                                                marginLeft: "4px",
                                                marginRight: "4px",
                                            }}
                                        />
                                    ) : null}
                                </Stack>
                                <Typography
                                    textAlign="end"
                                    variant="caption"
                                    color="text.secondary"
                                    mr={
                                        index === currentMessages.length - 1
                                            ? "28px"
                                            : "8px"
                                    }
                                >
                                    {formatMessageTime(message?.created_at)}
                                </Typography>
                            </YourMessage>
                        ) : (
                            <FriendMessage key={message._id} ml="14px">
                                <Avatar
                                    src={currentFriend?.userProfileImage}
                                    alt={`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                                    sx={{
                                        width: "33px",
                                        height: "33px",
                                        alignSelf: "flex-end",
                                    }}
                                />
                                <Stack>
                                    <MessageBubble
                                        bgcolor={
                                            isDarkMode ? "grey.800" : "grey.200"
                                        }
                                    >
                                        {message.messageType === "text" ? (
                                            <Typography
                                                variant="body2"
                                                color={
                                                    !isDarkMode &&
                                                    "text.primary"
                                                }
                                            >
                                                {message.content}
                                            </Typography>
                                        ) : (
                                            <img
                                                style={{ width: "100%" }}
                                                src={message.content}
                                                alt={message.content}
                                            />
                                        )}
                                    </MessageBubble>
                                    <Typography
                                        ml={1}
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {formatMessageTime(message?.created_at)}
                                    </Typography>
                                </Stack>
                            </FriendMessage>
                        )
                    )}
                </MessagesMain>
            )}
        </>
    );
};

export default Messages;
