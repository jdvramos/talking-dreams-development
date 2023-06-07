import { Box, Skeleton, styled, Stack } from "@mui/material";

const MessagesMain = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "7px 0",
    gap: "20px",
}));

const YourMessage = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
    maxWidth: "70%",
}));

const FriendMessage = styled(Box)(({ theme }) => ({
    display: "flex",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: "10px",
    maxWidth: "70%",
}));

const MessageBubbleSkeleton = styled(Skeleton)(({ theme }) => ({
    width: "57px",
    height: "41px",
}));

const MessagesSkeleton = ({ numOfAllowedSkeletonMessages }) => {
    return (
        <MessagesMain>
            {Array.from({ length: numOfAllowedSkeletonMessages }).map(
                (_, index) =>
                    (index + 1) % 2 === 0 ? (
                        <YourMessage
                            key={index}
                            mr={
                                index ===
                                numOfAllowedSkeletonMessages.length - 1
                                    ? 0
                                    : "20px"
                            }
                        >
                            <Stack direction="row" alignItems="flex-end">
                                <MessageBubbleSkeleton />
                                {index ===
                                    numOfAllowedSkeletonMessages.length - 1 && (
                                    <Skeleton
                                        variant="circular"
                                        sx={{
                                            width: "14px",
                                            height: "14px",
                                            marginLeft: "4px",
                                            marginRight: "4px",
                                        }}
                                    />
                                )}
                            </Stack>
                            <Skeleton
                                variant="rounded"
                                mr={
                                    index ===
                                    numOfAllowedSkeletonMessages.length - 1
                                        ? "28px"
                                        : "8px"
                                }
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    alignSelf: "flex-end",
                                }}
                            />
                        </YourMessage>
                    ) : (
                        <FriendMessage key={index} ml="14px">
                            <Skeleton
                                variant="circular"
                                sx={{
                                    width: "33px",
                                    height: "33px",
                                    alignSelf: "flex-end",
                                }}
                            />
                            <Stack>
                                <MessageBubbleSkeleton />
                                <Skeleton
                                    variant="rounded"
                                    mr={
                                        index ===
                                        numOfAllowedSkeletonMessages.length - 1
                                            ? "28px"
                                            : "8px"
                                    }
                                    sx={{ width: "20px", height: "20px" }}
                                />
                            </Stack>
                        </FriendMessage>
                    )
            )}
        </MessagesMain>
    );
};

export default MessagesSkeleton;
