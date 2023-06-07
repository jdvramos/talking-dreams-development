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
    Switch,
    FormControlLabel,
    Input,
    IconButton,
} from "@mui/material";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import AddIcon from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import isEmail from "validator/lib/isEmail";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser, uploadImageToCloudinary } from "../features/authSlice";

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

const SliderBox = styled(Box)(({ theme }) => ({
    height: "324px",
    position: "relative",
    overflow: "hidden",
    marginBottom: "4px",
}));

const SignUpDetailBox = styled(Box)(({ theme }) => ({
    marginTop: "4px",
    position: "absolute",
    top: 0,
    transition: "all 0.8s",
}));

const AddPhotoBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    position: "absolute",
    top: 0,
    height: "300px",
    transition: "all 0.8s",
    // backgroundColor: theme.palette.secondary.light,
    // border: "1px solid black",
}));

const CircleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "28px",
    border: "10px solid black",
    borderColor: theme.palette.primary.main,
}));

const UploadImageCircle = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "200px",
    borderRadius: "100%",
    color: theme.palette.primary.main,
    cursor: "pointer",
}));

const InputGroup = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "15px",
}));

const NAME_REGEX = /^[a-zA-Z]{2,50}( [a-zA-Z]{0,49}[a-zA-Z])? *$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const imageUploadRef = useRef();
    const signupDetailBoxRef = useRef();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [showAddPhoto, setShowAddPhoto] = useState(false);

    const [sliderBoxHeight, setSliderBoxHeight] = useState("324");

    const [signupTranslateValue, setSignupTranslateValue] = useState(0);
    const [photoBoxTranslateValue, setPhotoBoxTranslateValue] = useState(100);

    const [signupOpacityValue, setSignupOpacityValue] = useState(1);
    const [photoBoxOpacityValue, setPhotoBoxOpacityValue] = useState(0);

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

    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [validProfileImage, setValidProfileImage] = useState(false);

    const [realProfileImageData, setRealProfileImageData] = useState(null);

    const [disableNextButton, setDisableNextButton] = useState(true);

    const [errTitle, setErrTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [success, setSuccess] = useState(false);

    const showFirstNameHelperMsg =
        firstNameFocus && firstName && !validFirstName;

    const showLastNameHelperMsg = lastNameFocus && lastName && !validLastName;

    const showEmailHelperMsg = emailFocus && email && !validEmail;

    const showPwdHelperMsg = pwdFocus && !validPwd;

    const showMatchHelperMsg = matchFocus && !validMatch;

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
    }, [firstName, lastName, email, pwd, matchPwd, profileImagePreview]);

    useEffect(() => {
        const disableButton =
            !validFirstName ||
            !validLastName ||
            !validEmail ||
            !validPwd ||
            !validMatch
                ? true
                : false;

        setDisableNextButton(disableButton);
    }, [validFirstName, validLastName, validEmail, validPwd, validMatch]);

    useEffect(() => {
        if (signupDetailBoxRef.current) {
            setSliderBoxHeight(signupDetailBoxRef.current.offsetHeight);
        }
    }, [
        signupDetailBoxRef,
        showFirstNameHelperMsg,
        showLastNameHelperMsg,
        showEmailHelperMsg,
        showPwdHelperMsg,
        showMatchHelperMsg,
    ]);

    const handleChange = () => {
        setShowAddPhoto((prev) => !prev);

        setSignupTranslateValue((prev) => (prev === 0 ? -100 : 0));
        setPhotoBoxTranslateValue((prev) => (prev === 100 ? 0 : 100));

        setSignupOpacityValue((prev) => (prev === 1 ? 0 : 1));
        setPhotoBoxOpacityValue((prev) => (prev === 1 ? 0 : 1));
    };

    const handleUploadCircleClick = () => {
        imageUploadRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        console.log(file);
        console.log(file.type !== "image/jpeg");

        if (file === undefined) {
            setErrTitle("Error: Missing Image");
            setErrMsg("Please upload your profile picture");
            return;
        }

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            setErrTitle("Error: Invalid Image");
            setErrMsg(
                "Please upload a valid profile picture. Only files that have JPEG or PNG extensions are accepted."
            );
            return;
        }

        setRealProfileImageData(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setProfileImagePreview(reader.result);
        };

        setValidProfileImage(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(firstName);
        const v2 = NAME_REGEX.test(lastName);
        const v3 = isEmail(email);
        const v4 = PWD_REGEX.test(pwd);
        const v5 = pwd === matchPwd;
        const v6 = validProfileImage;
        if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
            setErrTitle("Error: Access Denied");
            setErrMsg("Invalid Entry");
            return;
        }

        function capitalizeFirstLetterOfEveryWord(str) {
            let words = str.split(" ");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            return words.join(" ");
        }

        const properFirstName = capitalizeFirstLetterOfEveryWord(firstName);
        const properLastName = capitalizeFirstLetterOfEveryWord(lastName);

        const data = new FormData();
        data.append("file", realProfileImageData);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dkkcgnkep");

        try {
            const userProfileImage = await dispatch(
                uploadImageToCloudinary({ data })
            ).unwrap();

            const result = await dispatch(
                registerUser({
                    firstName: properFirstName,
                    lastName: properLastName,
                    email,
                    pwd,
                    userProfileImage,
                })
            ).unwrap();

            console.log(result);
            setSuccess(true);
            // Clear the input fields by setting the state of user, pwd, matchPwd to empty string
            navigate("/", { state: { isNewlyRegistered: true } });
        } catch (err) {
            const { status, message } = err;

            if (status === 400) {
                setErrTitle("Error: Bad Request");
                setErrMsg(message);
            } else if (status === 409) {
                setErrTitle("Error: Conflict");
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
                        Sign up to Talking Dreams
                    </Typography>

                    {errTitle && errMsg && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            <AlertTitle>{errTitle}</AlertTitle>
                            {errMsg}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 4 }}>
                            <AlertTitle>Sign up Successful</AlertTitle>
                            Congratulations! You have successfully registered.
                            You will now be redirected to the homepage.
                        </Alert>
                    )}

                    <SliderBox sx={{ height: `${sliderBoxHeight}px` }}>
                        <SignUpDetailBox
                            ref={signupDetailBoxRef}
                            sx={{
                                transform: `translateX(${signupTranslateValue}%)`,
                                opacity: `${signupOpacityValue}`,
                            }}
                        >
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
                                            showFirstNameHelperMsg &&
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
                                            showLastNameHelperMsg &&
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
                                    showEmailHelperMsg &&
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
                                    showPwdHelperMsg &&
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
                                    showMatchHelperMsg &&
                                    "Confirm password must match the first password input field."
                                }
                            />
                        </SignUpDetailBox>

                        <AddPhotoBox
                            sx={{
                                transform: `translateX(${photoBoxTranslateValue}%)`,
                                opacity: `${photoBoxOpacityValue}`,
                            }}
                        >
                            <InputLabel
                                htmlFor="uploadImage"
                                sx={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "text.primary",
                                    position: "absolute",
                                    top: "4px",
                                    left: 0,
                                }}
                            >
                                Add Profile Picture
                            </InputLabel>
                            <Button
                                tabIndex={-1}
                                size="small"
                                startIcon={<KeyboardBackspaceIcon />}
                                onClick={handleChange}
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                            >
                                Go Back
                            </Button>
                            <IconButton
                                tabIndex={-1}
                                size="small"
                                color="primary"
                                onClick={handleChange}
                                sx={{
                                    display: { xs: "block", sm: "none" },
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <CircleContainer
                                borderRadius="100%"
                                sx={
                                    profileImagePreview
                                        ? {
                                              "&:hover label": {
                                                  opacity: 0.4,
                                              },
                                              "&:hover .onHoverMsg": {
                                                  display: "block",
                                                  position: "absolute",
                                                  top: "54%",
                                                  left: "50%",
                                                  transform:
                                                      "translate(-50%, -50%)",
                                                  margin: 0,
                                                  zIndex: 100,
                                              },
                                          }
                                        : {}
                                }
                            >
                                <UploadImageCircle
                                    component={InputLabel}
                                    htmlFor="uploadImage"
                                    onClick={handleUploadCircleClick}
                                >
                                    {profileImagePreview ? (
                                        <Box
                                            component="img"
                                            src={profileImagePreview}
                                            alt="user profile"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <AddIcon
                                            sx={{
                                                fontSize: "130px",
                                            }}
                                        />
                                    )}
                                </UploadImageCircle>
                                <Typography
                                    sx={{ cursor: "pointer" }}
                                    className="onHoverMsg"
                                    display="none"
                                >
                                    Change Image
                                </Typography>
                                <Input
                                    type="file"
                                    id="uploadImage"
                                    accept="image/*"
                                    ref={imageUploadRef}
                                    onChange={handleImageChange}
                                    sx={{ display: "none" }}
                                ></Input>
                            </CircleContainer>
                        </AddPhotoBox>
                    </SliderBox>

                    {!showAddPhoto && (
                        <span
                            style={{ display: "block", cursor: "not-allowed" }}
                        >
                            <Button
                                disabled={disableNextButton}
                                onClick={handleChange}
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
                                Next
                            </Button>
                        </span>
                    )}

                    {showAddPhoto && (
                        <span
                            style={{ display: "block", cursor: "not-allowed" }}
                        >
                            <Button
                                disabled={
                                    !validFirstName ||
                                    !validLastName ||
                                    !validEmail ||
                                    !validPwd ||
                                    !validMatch ||
                                    !validProfileImage
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
                    )}

                    {/* <FormControlLabel
                        control={
                            <Switch
                                checked={showAddPhoto}
                                onChange={handleChange}
                            />
                        }
                        label="Show from target"
                    /> */}
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
                </AuthBox>
            </Stack>
        </Stack>
    );
};

export default Register;
