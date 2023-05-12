import {
    Avatar,
    Box,
    IconButton,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const CBHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    borderBottomWidth: "thin",
}));

const CBFriendInfo = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
}));

const CBMessages = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

const CBSender = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    borderTopWidth: "thin",
}));

const ChatBox = ({ currentFriend, mdBelow, setShowChatList }) => {
    return (
        <>
            {currentFriend ? (
                <>
                    <CBHeader>
                        {mdBelow && (
                            <IconButton
                                onClick={() => setShowChatList(true)}
                                aria-label="back"
                                sx={{ marginLeft: 1 }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        )}
                        <CBFriendInfo marginLeft={!mdBelow ? 3 : 1}>
                            <Avatar
                                src={currentFriend?.userProfileImage}
                                alt={`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                                sx={{ width: "44px", height: "44px" }}
                            />
                            <Stack ml={1}>
                                <Typography
                                    variant="body1"
                                    component="h2"
                                    fontWeight={500}
                                >
                                    {`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    fontSize="0.80rem"
                                    fontWeight={400}
                                    color="text.secondary"
                                >
                                    Online
                                </Typography>
                            </Stack>
                        </CBFriendInfo>
                        <IconButton
                            aria-label="more info"
                            sx={{ marginRight: 1 }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </CBHeader>
                    <CBMessages>
                        <Typography variant="body2">Messages</Typography>
                    </CBMessages>
                    <CBSender>
                        <Typography variant="body2">Chat Box</Typography>
                    </CBSender>
                </>
            ) : (
                <Typography
                    mx="auto"
                    variant="h5"
                    fontWeight={700}
                    component="h3"
                >
                    Select a chat or start a new conversation
                </Typography>
            )}
        </>
    );
};

export default ChatBox;
