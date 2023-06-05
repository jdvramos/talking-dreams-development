import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Autocomplete,
    Box,
    Avatar,
    Stack,
    TextField,
    Button,
    useTheme,
    CircularProgress,
} from "@mui/material";
import useUsers from "../hooks/useUsers";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import UserOption from "./UserOption";

const AddFriendDialog = ({
    addFriendDialogOpen,
    setAddFriendDialogOpen,
    friendToAdd,
    setFriendToAdd,
    handleAddFriend,
    isDarkMode,
    sendFriendRequest,
}) => {
    const theme = useTheme();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const [userOptions, setUserOptions] = useState([]);
    const { isLoading, results, setResults, hasNextPage } = useUsers(
        page,
        search
    );

    const defaultValue = {
        _id: "6455e1c0075b7bf507f6de0b",
        firstName: "Saul",
        lastName: "Goodman",
        email: "saulgoodman@gmail.com",
        userProfileImage:
            "https://res.cloudinary.com/dkkcgnkep/image/upload/v1683349951/nxbrqywajxpgm9jzblwz.png",
        friends: [],
        preferredTheme: "dark",
        refreshToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdWxnb29kbWFuQGdtYWlsLmNvbSIsImlhdCI6MTY4NTg4MzgwNSwiZXhwIjoxNjg1OTcwMjA1fQ.65eUiTr7sPY26FPeioBZ8JFwnhxsDUK9ymA82f1AP8k",
        created_at: "2023-05-06T05:12:32.068Z",
        updated_at: "2023-06-04T13:03:25.083Z",
    };

    // const [value, setValue] = useState(userOptions[0] || defaultValue);
    const [value, setValue] = useState(null);

    const [inputValue, setInputValue] = useState("");

    const showNoResults = !isLoading && results.length === 0;

    const intObserver = useRef();

    const debounce = () => {
        let timeoutID;
        return (e, newInputValue) => {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                setSearch(newInputValue);
            }, 1000);
        };
    };

    const optimizedDebounce = useMemo(
        (e, newInputValue) => debounce(e, newInputValue),
        []
    );

    const lastPostRef = useCallback(
        (user) => {
            if (isLoading) return;

            if (intObserver.current) intObserver.current.disconnect();

            intObserver.current = new IntersectionObserver((users) => {
                if (users[0].isIntersecting && hasNextPage) {
                    console.log("We are near the last user!");
                    setPage((prev) => prev + 1);
                }
            });

            if (user) intObserver.current.observe(user);
        },
        [isLoading, hasNextPage]
    );

    const handleClick = () => {
        sendFriendRequest(value);
        setValue(null);
    };

    useEffect(() => {
        if (results.length > 0) {
            console.log(results);

            let modifiedResults;

            // Why we set isLast to false to all results if results.length is less than or equal 4? Because by doing this it prevents the observer from lastPostRef from running and changing the page using setPage. The height of our ListBox is at 210px which is capable of showing the first 4 results (the limit in backend is 5), so when the result of the query will show just 4 we will not run the infinite scroll logic, however if it's more than 4, for example, 5 the lastPageRef will put into the 5th element.
            if (results.length <= 4) {
                modifiedResults = results.map((user, i) => {
                    const isLast = false;
                    return { ...user, isLast };
                });
            } else {
                modifiedResults = results.map((user, i) => {
                    const isLast = results.length === i + 1 ? true : false;
                    return { ...user, isLast };
                });
            }

            console.log("modifiedResults", modifiedResults);
            setUserOptions(modifiedResults);
        }
    }, [results]);

    useEffect(() => {
        console.log("VALUE", value);
    }, [value]);

    useEffect(() => {
        setUserOptions([]);
        setResults([]);
        setPage(1);
    }, [search]);

    useEffect(() => {
        console.log("PAGE", page);
        console.log("SEARCH", search || "(empty)");
    }, [page, search]);

    return (
        <Dialog
            open={addFriendDialogOpen}
            onClose={() => setAddFriendDialogOpen(false)}
            fullWidth
        >
            <DialogTitle id="dialog-title">Add a friend</DialogTitle>
            <DialogContent>
                <Typography mb={1}>Search by name or email:</Typography>
                <Autocomplete
                    size="small"
                    options={userOptions}
                    value={value}
                    onChange={(_event, newValue) => setValue(newValue)}
                    onInputChange={(e, newInputValue) => {
                        setInputValue(newInputValue);
                        optimizedDebounce(e, newInputValue);
                    }}
                    inputValue={inputValue}
                    getOptionLabel={(option) => {
                        if (
                            option?.firstName === undefined ||
                            option?.lastName === undefined
                        ) {
                            return "";
                        } else {
                            return `${option?.firstName} ${option?.lastName}`;
                        }
                    }}
                    filterOptions={(options, { inputValue }) => options} // Disable filtering
                    isOptionEqualToValue={(option, value) =>
                        option?._id === value?._id
                    }
                    noOptionsText={
                        showNoResults ? (
                            "No results"
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px",
                                }}
                            >
                                <CircularProgress size={20} />
                                <Typography
                                    variant="body2"
                                    ml={1}
                                    color="text.secondary"
                                >
                                    Loading...
                                </Typography>
                            </Box>
                        )
                    }
                    renderOption={(props, option) => {
                        if (isLoading && option.isLast) {
                            // Render loading box when isLoading is true and it's the last option
                            return (
                                <Box
                                    {...props}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px",
                                    }}
                                >
                                    <CircularProgress size={20} />
                                    <Typography
                                        variant="body2"
                                        ml={1}
                                        color="text.secondary"
                                    >
                                        Loading...
                                    </Typography>
                                </Box>
                            );
                        } else if (option.isLast) {
                            // Render regular option without loading box
                            return (
                                <UserOption
                                    key={option._id}
                                    ref={lastPostRef}
                                    option={option}
                                    {...props}
                                />
                            );
                        } else {
                            // Render regular option without loading box
                            return (
                                <UserOption
                                    key={option._id}
                                    option={option}
                                    {...props}
                                />
                            );
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "off", // disable autocomplete and autofill
                            }}
                        />
                    )}
                    ListboxProps={{
                        sx: {
                            maxHeight: "210px",
                            "&::-webkit-scrollbar": {
                                width: "6px",
                                backgroundColor:
                                    theme.palette.background.default,
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: isDarkMode
                                    ? "#5e5e5e"
                                    : "#C4C4C4",
                                borderRadius: "3px",
                            },
                        },
                        // disabled: isLoading,
                    }}
                ></Autocomplete>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setAddFriendDialogOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleClick} autoFocus>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFriendDialog;
