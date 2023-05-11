import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";

function App() {
    const [mode, setMode] = useState("light");

    const theme = createTheme({
        typography: {
            fontFamily: ["Outfit", "sans-serif"].join(","),
        },
        palette: {
            mode: mode,
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Messenger setMode={setMode} />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
