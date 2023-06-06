import { Alert, Snackbar } from "@mui/material";
import { BiMailSend } from "react-icons/bi";

const FriendRequestReceivedSnackbar = ({
    showFriendRequestReceivedAlert,
    setShowFriendRequestReceivedAlert,
    isDarkMode,
    mdBelow,
}) => {
    return (
        <Snackbar
            open={showFriendRequestReceivedAlert.showAlert}
            onClose={() =>
                setShowFriendRequestReceivedAlert({
                    showAlert: false,
                    senderName: "",
                })
            }
            autoHideDuration={4000}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            style={{
                top: mdBelow ? "55px" : "20px",
            }}
        >
            <Alert
                iconMapping={{
                    info: <BiMailSend size={24} />,
                }}
                severity="info"
                sx={{
                    backgroundColor: isDarkMode
                        ? "info.dark"
                        : "rgb(229, 246, 253)",
                    color: isDarkMode ? "text.primary" : "rgb(1, 67, 97)",
                    "& .MuiAlert-icon": {
                        alignSelf: "center",
                        color: isDarkMode ? "text.primary" : "rgb(1, 67, 97)",
                    },
                }}
            >
                {`${showFriendRequestReceivedAlert.senderName} has sent you a friend request`}
            </Alert>
        </Snackbar>
    );
};

export default FriendRequestReceivedSnackbar;
