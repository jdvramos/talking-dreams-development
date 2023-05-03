const mongoose = require("mongoose");

// This returns a promise
const connectDB = (url) => {
    return mongoose.connect(url);
};

module.exports = connectDB;
