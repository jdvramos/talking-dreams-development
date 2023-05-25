import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tabs,
    Tab,
    Box,
    Avatar,
    Stack,
    TextField,
    Button,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

function TabPanelReceived(props) {
    const { value, index, data, theme, isDarkMode } = props;

    return (
        <Stack
            role="tabpanel"
            display={value !== index ? "none" : "flex"}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            flex={1}
            gap={2}
            sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                    width: "6px",
                    backgroundColor: isDarkMode
                        ? "#383838"
                        : theme.palette.background.default,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: isDarkMode ? "#5e5e5e" : "#C4C4C4",
                    borderRadius: "3px",
                },
            }}
        >
            {value === index && data.length > 0 ? (
                data.map((person, index) => (
                    <Stack direction="row" gap={1} key={index} mx={1}>
                        <Avatar
                            src={person?.userProfileImage}
                            alt={`${person?.firstName} ${person?.lastName}`}
                            sx={{
                                alignSelf: "center",
                                width: "70px",
                                height: "70px",
                            }}
                        />
                        <Stack flex={1}>
                            <Stack mb={1}>
                                <Typography
                                    fontWeight={500}
                                >{`${person?.firstName} ${person?.lastName}`}</Typography>
                                <Typography variant="caption">
                                    {person?.email}
                                </Typography>
                            </Stack>
                            <Stack direction="row">
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: "#1976d2",
                                        marginRight: "8px",
                                    }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    color="error"
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: "#d32f2f",
                                    }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                ))
            ) : (
                <Box>
                    <Typography variant="body2" mx={1}>
                        You have not received any friend requests at the moment
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}

function TabPanelSent(props) {
    const { value, index, data, theme, isDarkMode } = props;

    return (
        <Stack
            role="tabpanel"
            display={value !== index ? "none" : "flex"}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            flex={1}
            gap={2}
            sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                    width: "6px",
                    backgroundColor: isDarkMode
                        ? "#383838"
                        : theme.palette.background.default,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: isDarkMode ? "#5e5e5e" : "#C4C4C4",
                    borderRadius: "3px",
                },
            }}
        >
            {value === index && data.length > 0 ? (
                data.map((person, index) => (
                    <Stack direction="row" gap={1} key={index} mx={1}>
                        <Avatar
                            src={person?.userProfileImage}
                            alt={`${person?.firstName} ${person?.lastName}`}
                            sx={{
                                alignSelf: "center",
                                width: "70px",
                                height: "70px",
                            }}
                        />
                        <Stack flex={1}>
                            <Stack mb={1}>
                                <Typography
                                    fontWeight={500}
                                >{`${person?.firstName} ${person?.lastName}`}</Typography>
                                <Typography variant="caption">
                                    {person?.email}
                                </Typography>
                            </Stack>
                            <Stack direction="row">
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    fullWidth
                                    color="error"
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: "#d32f2f",
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                ))
            ) : (
                <Box>
                    <Typography variant="body2" mx={1}>
                        You have not sent any friend requests yet
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const ViewFriendsDialog = ({
    fakeFriendRequestSent,
    fakeFriendRequestReceived,
    viewFriendsDialogOpen,
    setViewFriendsDialogOpen,
    isDarkMode,
}) => {
    const theme = useTheme();

    const [value, setValue] = useState(0);

    const handleChangeTab = (_event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    return (
        <Dialog
            open={viewFriendsDialogOpen}
            onClose={() => setViewFriendsDialogOpen(false)}
            sx={{
                "& .MuiDialog-paper": {
                    width: "350px",
                    height: "300px",
                },
            }}
        >
            <DialogTitle sx={{ paddingLeft: "16px" }}>
                Friends Requests
            </DialogTitle>
            <Box
                flex={1}
                display="flex"
                sx={{
                    justifyContent: "center",
                    overflowY: "auto",
                }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChangeTab}
                    sx={{
                        borderRight: 1,
                        borderColor: "divider",
                    }}
                >
                    <Tab label="Received" {...a11yProps(0)} />
                    <Tab label="Sent" {...a11yProps(1)} />
                </Tabs>
                <TabPanelReceived
                    value={value}
                    index={0}
                    data={fakeFriendRequestReceived}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
                <TabPanelSent
                    value={value}
                    index={1}
                    data={fakeFriendRequestSent}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            </Box>
            <DialogActions>
                <Button onClick={() => setViewFriendsDialogOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewFriendsDialog;
