import { Avatar, Box, Typography, styled } from "@mui/material";

const FriendInfoMain = styled(Box)(({ theme }) => ({
    display: "flex",
    margin: "40px 0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const FriendInfo = ({ currentFriend }) => {
    return (
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
        </FriendInfoMain>
    );
};

export default FriendInfo;
