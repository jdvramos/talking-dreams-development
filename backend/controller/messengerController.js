const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
// const Message = require("../models/Message");

module.exports.getFriends = async (req, res) => {
    const userEmail = req.email;
    res.status(StatusCodes.OK).json({ userEmail });
};
