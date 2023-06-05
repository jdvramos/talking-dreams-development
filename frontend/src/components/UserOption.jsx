import React from "react";

import { Box, Avatar, Stack, Typography } from "@mui/material";

const UserOption = React.forwardRef(({ option, ...props }, ref) => {
    const content = ref ? (
        <Box ref={ref} component="li" {...props}>
            <Avatar
                src={option.userProfileImage}
                alt={`${option.firstName} ${option.lastName}`}
                sx={{
                    marginRight: "15px",
                    width: "50px",
                    height: "50px",
                }}
            />
            <Stack>
                <Typography
                    fontWeight={500}
                >{`${option.firstName} ${option.lastName}`}</Typography>
                <Typography variant="caption">{option.email}</Typography>
            </Stack>
        </Box>
    ) : (
        <Box component="li" {...props}>
            <Avatar
                src={option.userProfileImage}
                alt={`${option.firstName} ${option.lastName}`}
                sx={{
                    marginRight: "15px",
                    width: "50px",
                    height: "50px",
                }}
            />
            <Stack>
                <Typography
                    fontWeight={500}
                >{`${option.firstName} ${option.lastName}`}</Typography>
                <Typography variant="caption">{option.email}</Typography>
            </Stack>
        </Box>
    );

    return content;
});

export default UserOption;
