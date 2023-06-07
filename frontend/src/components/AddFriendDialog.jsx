import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Autocomplete,
    Box,
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
    isDarkMode,
    sendFriendRequest,
    friends,
    friendRequestSent,
    friendRequestReceived,
    newUsersList,
    setShowFriendRequestSentAlert,
}) => {
    const theme = useTheme();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [userOptions, setUserOptions] = useState([]);

    const { isLoading, results, setResults, hasNextPage } = useUsers(
        page,
        search,
        friends,
        friendRequestSent,
        friendRequestReceived,
        newUsersList
    );

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
        setShowFriendRequestSentAlert(true);
        setValue(null);
    };

    const handleCloseDialogue = () => {
        setValue(null);
        setAddFriendDialogOpen(false);
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
        console.log("CURRENT VAL: ", value);
    }, [value]);

    useEffect(() => {
        setUserOptions([]);
        setResults([]);
        setPage(1);
    }, [search]);

    useEffect(() => {
        setUserOptions([]);
        setResults([]);
        setInputValue("");
        setPage(1);
    }, [friends, friendRequestSent, friendRequestReceived, newUsersList]);

    return (
        <Dialog
            open={addFriendDialogOpen}
            onClose={handleCloseDialogue}
            fullWidth
        >
            <DialogTitle id="dialog-title">Add a friend</DialogTitle>
            <DialogContent>
                <Typography mb="3px">Search by name or email:</Typography>
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
                <Button onClick={handleCloseDialogue}>Close</Button>
                <Button onClick={handleClick} autoFocus disabled={!value}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFriendDialog;
