import { Avatar, Box, Typography, styled } from "@mui/material";

const FriendInfoMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const ChatInfo = ({ currentFriend }) => {
    return (
        <>
            <FriendInfoMain>
                <Avatar
                    src={currentFriend?.userProfileImage}
                    alt={`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                    sx={{ width: "100px", height: "100px" }}
                />
                <Typography mt={2} variant="h5" component="h3" fontWeight={500}>
                    {`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentFriend?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Joined on December 18, 2018
                </Typography>
            </FriendInfoMain>
        </>
    );
};

export default ChatInfo;
