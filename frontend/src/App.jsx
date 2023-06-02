import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import CheckJWTExistence from "./components/CheckJWTExistence";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { getPreferredTheme } from "./features/messengerSlice";

function App() {
    const preferredTheme = useSelector(getPreferredTheme);

    const theme = createTheme({
        typography: {
            fontFamily: ["Outfit", "sans-serif"].join(","),
        },
        palette: {
            mode: preferredTheme,
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route element={<CheckJWTExistence />}>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Messenger />} />
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
