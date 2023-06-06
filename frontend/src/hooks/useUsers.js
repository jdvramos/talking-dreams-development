import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { useDispatch } from "react-redux";
import { resetAllState } from "../features/resetAllState";
import { logoutUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const GET_ALL_USERS_URL = "/api/v1/messenger/get-all-users";

const useUsers = (
    page = 1,
    search,
    friends,
    friendRequestSent,
    friendRequestReceived,
    newUsersList
) => {
    const axiosPrivate = useAxiosPrivate();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);

    const getAllUsers = async (page = 1, search) => {
        let url = `?page=${page}`;

        if (search) {
            url += `&search=${search}`;
        }

        try {
            const response = await axiosPrivate.get(
                `${GET_ALL_USERS_URL}${url}`
            );
            return response.data.users;
        } catch (error) {
            // MIGHT LEAD TO ERRORS, CHECK LATER!
            await dispatch(logoutUser());
            dispatch(resetAllState());
            navigate("/login");
        }
    };

    useEffect(() => {
        setIsLoading(true);

        getAllUsers(page, search)
            .then((data) => {
                if (page > 1) {
                    setResults((prev) => [...prev, ...data]);
                } else {
                    setResults(data);
                }
                setHasNextPage(Boolean(data.length));
                setIsLoading(false);
            })
            .catch((e) => {
                setIsLoading(false);
            });
    }, [
        page,
        search,
        friends,
        friendRequestSent,
        friendRequestReceived,
        newUsersList,
    ]);

    return { isLoading, results, setResults, hasNextPage };
};

export default useUsers;
