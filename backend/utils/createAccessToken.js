const jwt = require("jsonwebtoken");

const createAccessToken = (email) => {
    const accessToken = jwt.sign(
        {
            email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
    );

    return accessToken;
};

module.exports = createAccessToken;
