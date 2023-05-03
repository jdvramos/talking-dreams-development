const jwt = require("jsonwebtoken");

const createRefreshToken = (email) => {
    const refreshToken = jwt.sign(
        {
            email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return refreshToken;
};

module.exports = createRefreshToken;
