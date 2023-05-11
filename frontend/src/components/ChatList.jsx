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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";
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
    [theme.breakpoints.up("xs")]: {
        width: "100%",
    },
    [theme.breakpoints.up("md")]: {
        width: "250px",
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

const ChatList = ({ setMode, mdBelow }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

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
        <ChatListMain>
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
                        <IconButton id="menu-btn" onClick={handleClickMenu}>
                            <SettingsIcon />
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
                        <IconButton>
                            <PersonAddAlt1Icon />
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
                    fakeFriends.map((friend, i) => (
                        <Friend key={i} friend={friend} userId={userId} />
                    ))}
            </CLFriends>
        </ChatListMain>
    );
};

export default ChatList;
