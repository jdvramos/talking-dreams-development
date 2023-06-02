import { Box, styled } from "@mui/material";

const DotTyping = styled(Box)(({ theme }) => ({
    margin: "5px 15px",
    position: "relative",
    width: "8px",
    height: "8px",
    borderRadius: "5px",
    backgroundColor: "#1976d2",
    color: "#1976d2",
    animation: "dot-flashing 1s infinite linear alternate",
    animationDelay: "0.5s",

    "&::before": {
        content: '""',
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: "-12px",
        width: "8px",
        height: "8px",
        borderRadius: "5px",
        backgroundColor: "#1976d2",
        color: "#1976d2",
        animation: "dot-flashing 1s infinite alternate",
        animationDelay: "0s",
    },

    "&::after": {
        content: '""',
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: "12px",
        width: "8px",
        height: "8px",
        borderRadius: "5px",
        backgroundColor: "#1976d2",
        color: "#1976d2",
        animation: "dot-flashing 1s infinite alternate",
        animationDelay: "1s",
    },

    "@keyframes dot-flashing": {
        "0%": {
            backgroundColor: "#1976d2",
        },
        "50%, 100%": {
            backgroundColor: "rgba(25, 118, 210, 0.2)",
        },
    },
}));

const FriendIsTyping = () => {
    return <DotTyping></DotTyping>;
};

export default FriendIsTyping;
