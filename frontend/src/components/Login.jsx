import {
    Box,
    Button,
    InputLabel,
    Stack,
    TextField,
    Typography,
    Link as MUILink,
    styled,
    Alert,
    AlertTitle,
} from "@mui/material";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";

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

const AuthBox = styled(Box)(({ theme }) => ({
    maxWidth: "300px",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "416px",
        width: "100%",
    },
}));

const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [errTitle, setErrTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg("");
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(loginUser({ email, pwd })).unwrap();

            setEmail("");
            setPwd("");
            setSuccess(true);
            navigate("/");
        } catch (err) {
            const { status, message } = err;

            if (status === 400) {
                setErrTitle("Error: Bad Request");
                setErrMsg(message);
            } else if (status === 401) {
                setErrTitle("Error: Unauthorized");
                setErrMsg(message);
            } else {
                setErrTitle("Error: Server Error");
                setErrMsg(
                    "Oops! Something went wrong on our end. Please try again later."
                );
            }
        }
    };

    return (
        <Stack direction="row" height="100%">
            <AuthSidebar></AuthSidebar>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                flex={1}
            >
                <AuthBox>
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

                    {errTitle && errMsg && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            <AlertTitle>{errTitle}</AlertTitle>
                            {errMsg}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 4 }}>
                            <AlertTitle>Sign in Successful</AlertTitle>
                            Redirecting...
                        </Alert>
                    )}

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
                            id="email"
                            type="email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                            autoComplete="off"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
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
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                        />

                        <span style={{ cursor: "not-allowed" }}>
                            <Button
                                disabled={!email || !pwd ? true : false}
                                onClick={handleSubmit}
                                variant="contained"
                                fullWidth
                                disableElevation
                                color="primary"
                                sx={{
                                    mb: 2,
                                    textTransform: "none",
                                    fontSize: "15px",
                                    "&.Mui-disabled": {
                                        // add styles for the disabled state here
                                        opacity: 0.5,
                                        pointerEvents: "none",
                                        backgroundColor: "primary.main",
                                        color: "#fff",
                                    },
                                }}
                            >
                                Sign In
                            </Button>
                        </span>
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
                </AuthBox>
            </Stack>
        </Stack>
    );
};

export default Login;
