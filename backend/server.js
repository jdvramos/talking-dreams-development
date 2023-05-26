// IMPORTANT: We use this package so that we don't need to put try/catch blocks in every controller that we have in this server. You can check the authController.js as an example. All the errors will be catched by the errorHandlerMiddleware.
require("express-async-errors");

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const authRoutes = require("./routes/authRoutes");
const messengerRoutes = require("./routes/messengerRoutes");
const persistRoute = require("./routes/persistRoute");
const refreshRoute = require("./routes/refreshRoute");
const verifyAccessToken = require("./middleware/verifyAccessToken");
const connectDB = require("./db/connectDB");
const errorHandlerMiddleware = require("./middleware/error-handler");

// To enable Access-Control-Allow-Credentials if req.headers.origin is included in the allowedOrigins.js
app.use(credentials);

// To enable CORS
app.use(cors(corsOptions));

// To parse req.body
app.use(bodyParser.json());

// To parse cookies
app.use(cookieParser());

// Auth route
app.use("/api/v1/auth", authRoutes);

// Persist route (much like the refresh route but instead of just returning the access token, it also returns the userInfo and the userProfileImage)
app.use("/api/v1/persist", persistRoute);

// Refresh route (uses refresh token to get new access token)
app.use("/api/v1/refresh", refreshRoute);

app.use("/api/v1/messenger", verifyAccessToken, messengerRoutes);

// To handle async errors in all controllers
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3500;

const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URI);
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
