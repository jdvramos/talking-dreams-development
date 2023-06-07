import { Box, Skeleton, Stack } from "@mui/material";

const FriendSkeleton = () => {
    return (
        <Box
            sx={{
                padding: "10px",
                height: "68px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Skeleton variant="circular" width={48} height={48} />
            <Stack
                justifyContent="space-between"
                flex={1}
                sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{ width: "30%", height: "40%" }}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: "65%", height: "40%" }}
                />
            </Stack>
        </Box>
    );
};

export default FriendSkeleton;
