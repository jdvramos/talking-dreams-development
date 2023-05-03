const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api.js");

class Conflict extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
    }
}

module.exports = Conflict;
