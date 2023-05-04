const { StatusCodes } = require("http-status-codes");

// This will catch all thrown errors
const errorHandlerMiddleware = (err, req, res, next) => {
    // If err.message exist (by throw new Error ('msg')) then use that one (from Controller)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later",
    };

    // When user registers with missing fields or when user tries to register with invalid email (from Mongoose)
    if (err.name === "ValidationError") {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(" ");
    }

    // When user tries to register an email that already exist (from Mongoose)
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.msg = `${Object.keys(err.keyValue)} has to be unique`;
    }

    console.log("Status code: ", defaultError.statusCode);
    console.log("Message: ", defaultError.msg);

    res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

module.exports = errorHandlerMiddleware;
