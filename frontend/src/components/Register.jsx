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
import isEmail from "validator/lib/isEmail";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";

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

const InputGroup = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "15px",
}));

const NAME_REGEX = /^[a-zA-Z]{2,50}( [a-zA-Z]{0,49}[a-zA-Z])? *$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
    const firstNameRef = useRef();

    const [firstName, setFirstName] = useState("");
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState("");
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errTitle, setErrTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        firstNameRef.current.focus();
    }, []);

    useEffect(() => {
        const result = NAME_REGEX.test(firstName);
        setValidFirstName(result);
    }, [firstName]);

    useEffect(() => {
        const result = NAME_REGEX.test(lastName);
        setValidLastName(result);
    }, [lastName]);

    useEffect(() => {
        const result = isEmail(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrTitle("");
        setErrMsg("");
    }, [firstName, lastName, email, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(firstName);
        const v2 = NAME_REGEX.test(lastName);
        const v3 = isEmail(email);
        const v4 = PWD_REGEX.test(pwd);
        const v5 = pwd === matchPwd;
        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrTitle("Error: Access Denied");
            setErrMsg("Invalid Entry");
            return;
        }

        // use trim and uppercase the first letter

        function capitalizeFirstLetterOfEveryWord(str) {
            let words = str.split(" ");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            return words.join(" ");
        }

        const properFirstName = capitalizeFirstLetterOfEveryWord(firstName);
        const properLastName = capitalizeFirstLetterOfEveryWord(lastName);

        console.log("First name: ", properFirstName);
        console.log("Last name: ", properLastName);
        console.log("Email: ", email);
        console.log("Pwd: ", pwd);
        console.log("Confirm: ", matchPwd);

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ properFirstName, properLastName, email, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            // Clear the input fields by setting the state of user, pwd, matchPwd to empty string
        } catch (err) {
            if (!err?.response) {
                setErrTitle("Error: Server Error");
                setErrMsg(
                    "Oops! Something went wrong on our end. Please try again later."
                );
            } else if (err.response?.status === 409) {
                setErrTitle("Error: Conflict");
                setErrMsg("Email is already registered.");
            } else {
                setErrTitle("Error: Invalid Input");
                setErrMsg(
                    "The server did not understand your request. Please check that you have filled out all required fields correctly and try again."
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
                        Sign up to Talking Dreams
                    </Typography>

                    {errTitle && errMsg && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            <AlertTitle>Error: Bad Request</AlertTitle>
                            The server could not understand your request because
                            it was malformed or incomplete. Please check your
                            inputs and try again.
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 4 }}>
                            <AlertTitle>Registration Successful</AlertTitle>
                            Congratulations! You have successfully registered.
                            You will now be redirected to the homepage.
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Stack sx={{ width: "50%" }}>
                                <InputLabel
                                    htmlFor="firstName"
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color:
                                            firstName && !validFirstName
                                                ? "error.main"
                                                : "text.primary",
                                    }}
                                >
                                    First Name
                                </InputLabel>
                                <TextField
                                    inputRef={firstNameRef}
                                    id="firstName"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 2 }}
                                    autoComplete="off"
                                    required
                                    error={
                                        firstName && !validFirstName
                                            ? true
                                            : false
                                    }
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    onFocus={() => setFirstNameFocus(true)}
                                    onBlur={() => setFirstNameFocus(false)}
                                    helperText={
                                        firstNameFocus &&
                                        firstName &&
                                        !validFirstName &&
                                        "First name must consist of 2-50 alphabetic characters only"
                                    }
                                />
                            </Stack>

                            <Stack sx={{ width: "50%" }}>
                                <InputLabel
                                    htmlFor="lastName"
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color:
                                            lastName && !validLastName
                                                ? "error.main"
                                                : "text.primary",
                                    }}
                                >
                                    Last Name
                                </InputLabel>
                                <TextField
                                    id="lastName"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 2 }}
                                    autoComplete="off"
                                    required
                                    error={
                                        lastName && !validLastName
                                            ? true
                                            : false
                                    }
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    onFocus={() => setLastNameFocus(true)}
                                    onBlur={() => setLastNameFocus(false)}
                                    helperText={
                                        lastNameFocus &&
                                        lastName &&
                                        !validLastName &&
                                        "Last name must consist of 2-50 alphabetic characters only"
                                    }
                                />
                            </Stack>
                        </InputGroup>

                        <InputLabel
                            htmlFor="email"
                            sx={{
                                fontSize: 16,
                                fontWeight: "600",
                                color:
                                    email && !validEmail
                                        ? "error.main"
                                        : "text.primary",
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
                            error={email && !validEmail ? true : false}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            helperText={
                                emailFocus &&
                                email &&
                                !validEmail &&
                                "Email address must be valid"
                            }
                        />

                        <InputLabel
                            htmlFor="password"
                            sx={{
                                fontSize: 16,
                                fontWeight: "600",
                                color:
                                    pwd && !validPwd
                                        ? "error.main"
                                        : "text.primary",
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
                            sx={{ mb: 2 }}
                            required
                            error={pwd && !validPwd ? true : false}
                            onChange={(e) => setPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            helperText={
                                pwdFocus &&
                                !validPwd &&
                                "Password must contain 8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: ! @ # $ %"
                            }
                        />

                        <InputLabel
                            htmlFor="confirmPassword"
                            sx={{
                                fontSize: 16,
                                fontWeight: "600",
                                color:
                                    matchPwd && !validMatch
                                        ? "error.main"
                                        : "text.primary",
                            }}
                        >
                            Confirm Password
                        </InputLabel>
                        <TextField
                            id="confirmPassword"
                            type="password"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 3 }}
                            required
                            error={matchPwd && !validMatch ? true : false}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            helperText={
                                matchFocus &&
                                !validMatch &&
                                "Confirm password must match the first password input field."
                            }
                        />

                        <span style={{ cursor: "not-allowed" }}>
                            <Button
                                disabled={
                                    !firstName ||
                                    !lastName ||
                                    !validEmail ||
                                    !validPwd ||
                                    !validMatch
                                        ? true
                                        : false
                                }
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
                                Create Account
                            </Button>
                        </span>
                    </form>
                    <Typography color="text.primary">
                        Already a member?{" "}
                        <MUILink
                            component={RouterLink}
                            to="/login"
                            underline="none"
                        >
                            Sign In
                        </MUILink>
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    );
};

export default Register;
