import { Alert, Snackbar } from "@mui/material";

const InvalidImageSnackbar = ({ showUploadError, setShowUploadError }) => {
    return (
        <Snackbar
            open={showUploadError}
            onClose={() => setShowUploadError(false)}
            autoHideDuration={2500}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            style={{
                top: "70px",
            }}
        >
            <Alert
                severity="error"
                sx={{
                    "& .MuiAlert-icon": {
                        alignSelf: "center",
                    },
                }}
            >
                Invalid file format. Please upload an image in either JPG or PNG
                format.
            </Alert>
        </Snackbar>
    );
};

export default InvalidImageSnackbar;
