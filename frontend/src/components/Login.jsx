import {
    Box,
    Button,
    InputLabel,
    Stack,
    TextField,
    Typography,
    Link as MUILink,
    styled,
} from "@mui/material";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AuthSidebar = styled(Box)(({ theme }) => ({
    display: "none",
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.up("lg")]: {
        display: "block",
        width: "450px",
    },
    [theme.breakpoints.up("xl")]: {
        width: "540px",
    },
}));

const Login = () => {
    const userNameRef = useRef();

    useEffect(() => {
        userNameRef.current.focus();
    }, []);

    return (
        <Stack direction="row" height="100%">
            <AuthSidebar></AuthSidebar>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                flex={1}
            >
                <Box maxWidth="416px" width="100%">
                    <Stack direction="row" alignItems="center" mb={4} gap={1}>
                        <Typography variant="h5" fontWeight={700} component="p">
                            talking dreams
                        </Typography>
                        <FilterDramaIcon sx={{ pt: "3px" }} />
                    </Stack>

                    <Typography
                        variant="h5"
                        component="h2"
                        fontWeight={600}
                        mb={4}
                        color="text.primary"
                    >
                        Sign in to Talking Dreams
                    </Typography>

                    <form>
                        <InputLabel
                            htmlFor="email"
                            sx={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "text.primary",
                            }}
                        >
                            Email
                        </InputLabel>
                        <TextField
                            inputRef={userNameRef}
                            id="email"
                            type="email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                            autoComplete="off"
                            required
                        />

                        <InputLabel
                            htmlFor="password"
                            sx={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "text.primary",
                            }}
                        >
                            Password
                        </InputLabel>
                        <TextField
                            id="password"
                            type="password"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 3 }}
                            required
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            disableElevation
                            color="primary"
                            sx={{
                                mb: 2,
                                textTransform: "none",
                                fontSize: "15px",
                            }}
                        >
                            Sign In
                        </Button>
                    </form>
                    <Typography color="text.primary">
                        Not a member?{" "}
                        <MUILink
                            component={RouterLink}
                            to="/register"
                            underline="none"
                        >
                            Sign up now
                        </MUILink>
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    );
};

export default Login;
