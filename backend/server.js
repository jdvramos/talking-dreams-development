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
const connectDB = require("./db/connectDB");
const errorHandlerMiddleware = require("./middleware/error-handler");

// To enable Access-Control-Allow-Credentials if req.headers.origin is included in the allowedOrigins.js
app.use(credentials);

// To enable CORS
app.use(cors(corsOptions));

// To parse req.body
app.use(bodyParser.json());

// Auth route
app.use("/api/v1/auth", authRoutes);

// To parse cookies
app.use(cookieParser());

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
