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
import CreateIcon from "@mui/icons-material/Create";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Friend from "./Friend";
import { useEffect, useState } from "react";

// FOR TESTING PURPOSES ONLY DELETE LATER
import { fakeFriends } from "../fakedata/fakedata";
import { userId } from "../fakedata/fakedata";

const ChatListMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // backgroundColor: theme.palette.secondary.light,
    // [theme.breakpoints.up("xs")]: {
    //     width: "100%",
    // },
    [theme.breakpoints.up("md")]: {
        width: "250px",
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderRightWidth: "thin",
    },
    [theme.breakpoints.up("lg")]: {
        width: "310px",
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
    handleSelectCurrentFriend,
    setMode,
    isDarkMode,
    mdBelow,
    showChatList,
    currentFriend,
    fakeActiveUsers,
}) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [switchChecked, setSwitchChecked] = useState(false);
    const open = Boolean(anchorEl);

    const handleDarkModeClick = () => {
        setSwitchChecked(!switchChecked);
    };

    useEffect(() => {
        if (switchChecked) {
            setMode("dark");
        } else {
            setMode("light");
        }
    }, [switchChecked]);

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
                            <MenuItem onClick={handleCloseMenu}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Sign out</ListItemText>
                            </MenuItem>
                        </Menu>
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
                        >
                            <CreateIcon />
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
                {fakeFriends &&
                    fakeFriends.length > 0 &&
                    fakeFriends.map((friend) => (
                        <Friend
                            key={friend.friendInfo._id}
                            friend={friend}
                            userId={userId}
                            handleSelectCurrentFriend={
                                handleSelectCurrentFriend
                            }
                            currentFriend={currentFriend}
                            fakeActiveUsers={fakeActiveUsers}
                        />
                    ))}
            </CLFriends>
        </ChatListMain>
    );
};

export default ChatList;
