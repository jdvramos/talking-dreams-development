import { Snackbar } from "@mui/material";

const FriendRequestSentSnackbar = ({
    friendRequestSent,
    setFriendRequestSent,
}) => {
    return (
        <Snackbar
            open={friendRequestSent}
            onClose={() => setFriendRequestSent(false)}
            message="Friend request sent successfully!"
            autoHideDuration={4000}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
        />
    );
};

export default FriendRequestSentSnackbar;
