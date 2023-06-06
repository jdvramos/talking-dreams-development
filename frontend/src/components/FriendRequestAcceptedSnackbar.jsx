import { Alert, Snackbar } from "@mui/material";
import { FaRegHandshake } from "react-icons/fa";

const FriendRequestAcceptedSnackbar = ({
    showNewFriendAlert,
    setShowNewFriendAlert,
    isDarkMode,
    mdBelow,
}) => {
    return (
        <Snackbar
            open={showNewFriendAlert.showAlert}
            onClose={() =>
                setShowNewFriendAlert({
                    showAlert: false,
                    newFriendName: "",
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
                    info: <FaRegHandshake size={24} />,
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
                {`${showNewFriendAlert.newFriendName} has accepted your friend request`}
            </Alert>
        </Snackbar>
    );
};

export default FriendRequestAcceptedSnackbar;
