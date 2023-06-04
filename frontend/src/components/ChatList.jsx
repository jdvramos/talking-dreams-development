import {
    Box,
    IconButton,
    styled,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    TextField,
    Switch,
    InputAdornment,
    useTheme,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Friend from "./Friend";
import { useEffect, useState } from "react";

const ChatListMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // backgroundColor: theme.palette.secondary.light,
    // [theme.breakpoints.up("xs")]: {
    //     width: "100%",
    // },
    [theme.breakpoints.up("md")]: {
        width: "310px",
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderRightWidth: "thin",
    },
    [theme.breakpoints.up("lg")]: {
        width: "370px",
    },
}));

const CLHeader = styled(Box)(({ theme }) => ({
    // backgroundColor: theme.palette.secondary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
}));

const CLHeaderContent = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const CLSearch = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: "0 15px",
    justifyContent: "center",
    alignItems: "center",
}));

const CLFriends = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "0 5px",
    alignItems: "center",
    // justifyContent: "center",
    // height: "calc(100vh - 109px)",
    flex: 1,
    overflowY: "auto",
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    "& .MuiFilledInput-input": {
        paddingTop: "8px",
    },
    marginBottom: "10px",
}));

const ChatList = ({
    userId,
    sortedChatList,
    handleSelectCurrentFriend,
    preferredTheme,
    dispatchSetPreferredTheme,
    isDarkMode,
    mdBelow,
    showChatList,
    currentFriend,
    onlineFriends,
    handleLogout,
    setAddFriendDialogOpen,
    setViewFriendsDialogOpen,
    dispatchSetChatList,
}) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (preferredTheme === "light") {
            setSwitchChecked(false);
        } else {
            setSwitchChecked(true);
        }
    }, [preferredTheme]);

    const handleDarkModeClick = () => {
        setSwitchChecked(!switchChecked);
        setIsInitialMount(false);
    };

    useEffect(() => {
        if (!isInitialMount) {
            if (switchChecked) {
                dispatchSetPreferredTheme("dark");
            } else {
                dispatchSetPreferredTheme("light");
            }
        }
    }, [switchChecked, isInitialMount]);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!mdBelow) {
            handleCloseMenu();
        }
    }, [mdBelow]);

    return (
        <ChatListMain
            sx={showChatList ? { width: "100%" } : { display: "none" }}
        >
            <CLHeader>
                <CLHeaderContent>
                    <Typography
                        pl="30px"
                        variant="h5"
                        fontWeight={700}
                        component="h1"
                    >
                        Chats
                    </Typography>
                    <Box pr="20px">
                        <IconButton
                            size="small"
                            sx={{
                                backgroundColor: isDarkMode
                                    ? "grey.800"
                                    : "grey.200",
                                marginRight: "13px",
                                "&:hover": {
                                    backgroundColor: isDarkMode
                                        ? "grey.700"
                                        : "grey.300",
                                },
                            }}
                            onClick={() => dispatchSetChatList()}
                        >
                            <RefreshIcon />
                        </IconButton>
                        <IconButton
                            id="menu-btn"
                            onClick={handleClickMenu}
                            size="small"
                            sx={{
                                backgroundColor: isDarkMode
                                    ? "grey.800"
                                    : "grey.200",
                                marginRight: "13px",
                                "&:hover": {
                                    backgroundColor: isDarkMode
                                        ? "grey.700"
                                        : "grey.300",
                                },
                            }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                        <Menu
                            id="menu-btn"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem onClick={handleDarkModeClick}>
                                <ListItemIcon>
                                    <DarkModeIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Dark Mode</ListItemText>
                                <Switch
                                    checked={switchChecked}
                                    onChange={() =>
                                        setSwitchChecked(!switchChecked)
                                    }
                                    sx={{ marginLeft: 2 }}
                                    size="small"
                                ></Switch>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Sign out</ListItemText>
                            </MenuItem>
                        </Menu>
                        {mdBelow && (
                            <IconButton
                                id="view-friends-btn"
                                size="small"
                                sx={{
                                    backgroundColor: isDarkMode
                                        ? "grey.800"
                                        : "grey.200",
                                    marginRight: "13px",
                                    "&:hover": {
                                        backgroundColor: isDarkMode
                                            ? "grey.700"
                                            : "grey.300",
                                    },
                                }}
                                onClick={() => setViewFriendsDialogOpen(true)}
                            >
                                <PeopleIcon />
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            sx={{
                                backgroundColor: isDarkMode
                                    ? "grey.800"
                                    : "grey.200",
                                "&:hover": {
                                    backgroundColor: isDarkMode
                                        ? "grey.700"
                                        : "grey.300",
                                },
                            }}
                            onClick={() => setAddFriendDialogOpen(true)}
                        >
                            <PersonAddIcon />
                        </IconButton>
                    </Box>
                </CLHeaderContent>
            </CLHeader>
            <CLSearch>
                <SearchTextField
                    id="search"
                    variant="filled"
                    className="roundedInput"
                    autoComplete="off"
                    placeholder="Search"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                className="searchIcon"
                                position="start"
                            >
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        disableUnderline: true, // <== added this
                    }}
                ></SearchTextField>
            </CLSearch>
            <CLFriends
                sx={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        backgroundColor: theme.palette.background.default,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: isDarkMode ? "#5e5e5e" : "#C4C4C4",
                        borderRadius: "3px",
                    },
                }}
            >
                {sortedChatList &&
                    sortedChatList.length > 0 &&
                    sortedChatList.map((friend) => (
                        <Friend
                            key={friend.friendInfo._id}
                            friend={friend}
                            userId={userId}
                            handleSelectCurrentFriend={
                                handleSelectCurrentFriend
                            }
                            currentFriend={currentFriend}
                            onlineFriends={onlineFriends}
                        />
                    ))}
            </CLFriends>
        </ChatListMain>
    );
};

export default ChatList;
