import { Alert, Snackbar } from "@mui/material";
import { RiMessage3Line } from "react-icons/ri";

const NewMessageReceivedSnackbar = ({
    showNewMessageReceivedAlert,
    setShowNewMessageReceivedAlert,
    isDarkMode,
    mdBelow,
}) => {
    return (
        <Snackbar
            open={showNewMessageReceivedAlert.showAlert}
            onClose={() =>
                setShowNewMessageReceivedAlert({
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
                    info: <RiMessage3Line size={24} />,
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
                {`${showNewMessageReceivedAlert.senderName} sent a new message`}
            </Alert>
        </Snackbar>
    );
};

export default NewMessageReceivedSnackbar;
