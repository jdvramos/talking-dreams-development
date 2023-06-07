import { Box, Skeleton, styled } from "@mui/material";

const FriendInfoMain = styled(Box)(({ theme }) => ({
    display: "flex",
    margin: "40px 0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const FriendOpeningSkeleton = () => {
    return (
        <FriendInfoMain>
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton
                variant="rounded"
                sx={{
                    marginTop: "16px",
                    marginBottom: "8px",
                    width: "150px",
                    height: "28px",
                }}
            />
            <Skeleton
                variant="rounded"
                sx={{ width: "200px", height: "14px" }}
            />
        </FriendInfoMain>
    );
};

export default FriendOpeningSkeleton;
