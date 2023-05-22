import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Autocomplete,
    Box,
    Avatar,
    Stack,
    TextField,
    Button,
} from "@mui/material";

const AddFriendDialog = ({
    fakeFriends,
    addFriendDialogOpen,
    setAddFriendDialogOpen,
    setFriendToAdd,
    handleAddFriend,
}) => {
    return (
        <Dialog
            open={addFriendDialogOpen}
            onClose={() => setAddFriendDialogOpen(false)}
            fullWidth
        >
            <DialogTitle id="dialog-title">Add a friend</DialogTitle>
            <DialogContent>
                <Typography mb={1}>Search by name or email:</Typography>
                <Autocomplete
                    size="small"
                    options={fakeFriends}
                    onChange={(_event, newValue) => setFriendToAdd(newValue)}
                    getOptionLabel={(option) =>
                        `${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`
                    }
                    filterOptions={(options, { inputValue }) => {
                        const input = inputValue.toLowerCase();
                        return options.filter((option) => {
                            const fullName = `${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`;
                            const email =
                                option?.friendInfo?.email.toLowerCase();
                            return (
                                fullName.toLowerCase().includes(input) ||
                                email.includes(input)
                            );
                        });
                    }}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            <Avatar
                                src={option?.friendInfo?.userProfileImage}
                                alt={`${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`}
                                sx={{
                                    marginRight: "15px",
                                    width: "50px",
                                    height: "50px",
                                }}
                            />
                            <Stack>
                                <Typography
                                    fontWeight={500}
                                >{`${option?.friendInfo?.firstName} ${option?.friendInfo?.lastName}`}</Typography>
                                <Typography variant="caption">
                                    {option?.friendInfo?.email}
                                </Typography>
                            </Stack>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                        />
                    )}
                ></Autocomplete>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setAddFriendDialogOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleAddFriend} autoFocus>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFriendDialog;
