const User = require("../models/User");
const createAccessToken = require("../utils/createAccessToken");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

module.exports.handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const refreshToken = cookies.jwt;

    // Check first if refreshToken we get from the cookie does exist in the db
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
                return res.sendStatus(StatusCodes.FORBIDDEN);
            }

            const accessToken = createAccessToken(foundUser.email);

            res.json({ accessToken });
        }
    );
};
