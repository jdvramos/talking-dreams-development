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
    useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import formatMessageTime from "../utils/formatMessageTime";

function TabPanelReceived(props) {
    const {
        value,
        index,
        data,
        theme,
        isDarkMode,
        declineFriendRequest,
        acceptFriendRequest,
    } = props;

    return (
        <Stack
            role="tabpanel"
            display={value !== index ? "none" : "flex"}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            flex={1}
            gap={2}
            sx={{
                alignItems: "center",
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
                data.map((person) => (
                    <Stack
                        direction="row"
                        gap={1}
                        key={person?.userData?._id}
                        mx={1}
                    >
                        <Avatar
                            src={person?.userData?.userProfileImage}
                            alt={`${person?.userData?.firstName} ${person?.userData?.lastName}`}
                            sx={{
                                alignSelf: "center",
                                width: "70px",
                                height: "70px",
                            }}
                        />
                        <Stack flex={1}>
                            <Stack mb={1}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        fontWeight={500}
                                    >{`${person?.userData?.firstName} ${person?.userData?.lastName}`}</Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {formatMessageTime(
                                            person?.timeReceived
                                        )}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption">
                                    {person?.userData?.email}
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
                                    onClick={() =>
                                        acceptFriendRequest(
                                            person?.userData?._id
                                        )
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        color: isDarkMode
                                            ? "#fff"
                                            : "rgba(0, 0, 0, 0.87)",
                                        backgroundColor: isDarkMode
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgb(228, 230, 235)",
                                        "&:hover": {
                                            backgroundColor: isDarkMode
                                                ? "grey.700"
                                                : "grey.400",
                                        },
                                    }}
                                    onClick={() =>
                                        declineFriendRequest(
                                            person?.userData?._id
                                        )
                                    }
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
    const {
        value,
        index,
        data,
        theme,
        isDarkMode,
        isDisplayBelow400px,
        cancelFriendRequest,
    } = props;

    return (
        <Stack
            role="tabpanel"
            display={value !== index ? "none" : "flex"}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            flex={1}
            gap={2}
            sx={{
                alignItems: !isDisplayBelow400px && "center",
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
                data.map((person) => (
                    <Stack
                        flex={isDisplayBelow400px ? 1 : 0}
                        direction="row"
                        gap={1}
                        key={person?.userData?._id}
                        mx={1}
                        sx={
                            !isDisplayBelow400px
                                ? {
                                      width: "222px",
                                  }
                                : {}
                        }
                    >
                        <Avatar
                            src={person?.userData?.userProfileImage}
                            alt={`${person?.userData?.firstName} ${person?.userData?.lastName}`}
                            sx={{
                                alignSelf: "center",
                                width: "70px",
                                height: "70px",
                            }}
                        />
                        <Stack flex={1}>
                            <Stack mb={1}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        fontWeight={500}
                                    >{`${person?.userData?.firstName} ${person?.userData?.lastName}`}</Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {formatMessageTime(person?.timeSent)}
                                    </Typography>
                                </Stack>

                                <Typography variant="caption">
                                    {person?.userData?.email}
                                </Typography>
                            </Stack>
                            <Stack direction="row">
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    fullWidth
                                    sx={{
                                        color: isDarkMode
                                            ? "#fff"
                                            : "rgba(0, 0, 0, 0.87)",
                                        backgroundColor: isDarkMode
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgb(228, 230, 235)",
                                        "&:hover": {
                                            backgroundColor: isDarkMode
                                                ? "grey.700"
                                                : "grey.400",
                                        },
                                    }}
                                    onClick={() =>
                                        cancelFriendRequest(
                                            person?.userData?._id
                                        )
                                    }
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
    friendRequestSent,
    friendRequestReceived,
    viewFriendsDialogOpen,
    setViewFriendsDialogOpen,
    isDarkMode,
    cancelFriendRequest,
    declineFriendRequest,
    acceptFriendRequest,
}) => {
    const theme = useTheme();

    const isDisplayBelow400px = useMediaQuery("(max-width:400px)");

    const [value, setValue] = useState(0);

    const handleChangeTab = (_event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog
            open={viewFriendsDialogOpen}
            onClose={() => setViewFriendsDialogOpen(false)}
            sx={{
                "& .MuiDialog-paper": {
                    width: "400px",
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
                        width: isDisplayBelow400px ? "50px" : "90px",
                        borderRight: 1,
                        borderColor: "divider",
                        "& .MuiTabs-scroller": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    }}
                >
                    <Tab
                        label={isDisplayBelow400px ? "R" : "Received"}
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={isDisplayBelow400px ? "S" : "Sent"}
                        {...a11yProps(1)}
                    />
                </Tabs>
                <TabPanelReceived
                    value={value}
                    index={0}
                    data={friendRequestReceived}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    declineFriendRequest={declineFriendRequest}
                    acceptFriendRequest={acceptFriendRequest}
                />
                <TabPanelSent
                    value={value}
                    index={1}
                    data={friendRequestSent}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    isDisplayBelow400px={isDisplayBelow400px}
                    cancelFriendRequest={cancelFriendRequest}
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
