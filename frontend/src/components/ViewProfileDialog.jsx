import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    styled,
    Avatar,
} from "@mui/material";

import dateToString from "../utils/dateToString";

const UserInfo = styled(Box)(({ theme }) => ({
    display: "flex",
    marginTop: "40px",
    marginBottom: "20px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const ViewProfileDialog = ({
    userInfo,
    userProfileImage,
    viewProfileDialogOpen,
    setViewProfileDialogOpen,
}) => {
    return (
        <Dialog
            open={viewProfileDialogOpen}
            onClose={() => setViewProfileDialogOpen(false)}
            fullWidth
        >
            <DialogContent>
                <UserInfo>
                    <Avatar
                        src={userProfileImage}
                        alt={`${userInfo?.firstName} ${userInfo?.lastName}`}
                        sx={{ width: "100px", height: "100px" }}
                    />
                    <Typography
                        mt={2}
                        variant="h5"
                        component="h3"
                        fontWeight={500}
                    >
                        {`${userInfo?.firstName} ${userInfo?.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {userInfo?.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {`Joined on ${dateToString(userInfo?.created_at)}`}
                    </Typography>
                </UserInfo>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ color: "#1976d2" }}
                    onClick={() => setViewProfileDialogOpen(false)}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewProfileDialog;
