// This extends the built-in Error class in JS. We implement this so that we can pass in a status code (instead of just the message) when throwing an error which will be used in the error-handler.js
class CustomAPIError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = CustomAPIError;
