import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: ["Outfit", "sans-serif"].join(","),
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Messenger />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
