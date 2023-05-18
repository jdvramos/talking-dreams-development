import {
    Avatar,
    Box,
    ImageList,
    ImageListItem,
    Stack,
    Typography,
    styled,
    useTheme,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/Filter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";

const FriendInfoMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const MediaButton = styled(Box)(({ theme }) => ({
    width: "95%",
    marginTop: "20px",
    padding: "10px",
    display: "flex",
    color: theme.palette.text.primary,
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "5px",
}));

const MediaContainer = styled(Stack)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "95%",
    height: "100%",
    // maxWidth: "500px",
    overflowY: "auto",
}));

const NoMediaContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const ChatInfo = ({ currentFriend, currentMessages, isDarkMode, xlAbove }) => {
    const theme = useTheme();

    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [currentMediaMessages, setCurrentMediaMessages] = useState([]);

    useEffect(() => {
        if (currentMessages?.length > 0) {
            const mediaList = currentMessages.filter(
                (message) => message.messageType === "image"
            );
            setCurrentMediaMessages(mediaList);
        }
    }, [currentMessages]);

    return (
        <>
            <FriendInfoMain>
                <Avatar
                    src={currentFriend?.userProfileImage}
                    alt={`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                    sx={{ width: "100px", height: "100px" }}
                />
                <Typography mt={2} variant="h5" component="h3" fontWeight={500}>
                    {`${currentFriend?.firstName} ${currentFriend?.lastName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentFriend?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Joined on December 18, 2018
                </Typography>
            </FriendInfoMain>
            <MediaButton
                sx={{
                    "&:hover": {
                        backgroundColor: isDarkMode ? "grey.800" : "grey.200",
                    },
                }}
                onClick={() => setIsMediaOpen((prev) => !prev)}
            >
                <Stack direction="row" gap={1}>
                    <FilterIcon />
                    <Typography fontWeight="500" sx={{ userSelect: "none" }}>
                        Media
                    </Typography>
                </Stack>
                <ExpandMoreIcon
                    sx={{
                        transform: isMediaOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                    }}
                />
            </MediaButton>
            <MediaContainer>
                {isMediaOpen &&
                    (currentMediaMessages.length > 0 ? (
                        <ImageList
                            cols={xlAbove ? 3 : 2}
                            rowHeight={xlAbove ? 155 : 118}
                            sx={{
                                width: "100%",
                                height: "90%",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                    backgroundColor:
                                        theme.palette.background.default,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: isDarkMode
                                        ? "#5e5e5e"
                                        : "#C4C4C4",
                                    borderRadius: "3px",
                                },
                            }}
                        >
                            {currentMediaMessages.map((item) => (
                                <ImageListItem key={item._id}>
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={item.content}
                                        alt={item.content}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    ) : (
                        <NoMediaContainer>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                fontWeight="600"
                            >
                                No media
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                {`Photos that you exchange with ${currentFriend?.firstName} ${currentFriend?.lastName} will appear here`}
                            </Typography>
                        </NoMediaContainer>
                    ))}
            </MediaContainer>
        </>
    );
};

export default ChatInfo;
