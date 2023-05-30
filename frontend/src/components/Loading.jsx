import { Box, styled, CircularProgress } from "@mui/material";

const CenteredBox = styled(Box)(({ theme }) => ({
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const Loading = () => {
    return (
        <CenteredBox>
            <CircularProgress />
        </CenteredBox>
    );
};

export default Loading;
