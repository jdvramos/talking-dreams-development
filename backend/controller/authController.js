const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const {
    BadRequestError,
    Conflict,
    UnAuthenticatedError,
} = require("../errors/index");

const createAccessToken = require("../utils/createAccessToken");
const createRefreshToken = require("../utils/createRefreshToken");

// NOTE: If you are wondering why our controllers here do not have try/catch errors is because, basically, we set the express-async-errors package and import it in the server.js
module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, pwd, userProfileImage } = req.body;

    if (!firstName || !lastName || !email || !pwd || !userProfileImage) {
        throw new BadRequestError(
            "The server could not process your request because it contained invalid or incomplete data. Please check your inputs and try again."
        );
    }

    // Somewhat replaces the 11000 Mongoose error code that we have in the error-handler.js
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
        throw new Conflict(
            "It seems that this email has already been used to create an account. Please try logging in or use a different email to register."
        );
    }

    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);

    // The user is now actually an instance of UserSchema. Password will be encrypted by the pre-save hook in the ../models/User
    const user = await User.create({
        firstName,
        lastName,
        email,
        pwd,
        userProfileImage,
        refreshToken,
    });

    // Cookie is sent for every request, however httpOnly is secured because JS can't access it
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    // // Use this instead when testing over network
    // res.cookie("jwt", refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000,
    // });

    res.status(StatusCodes.CREATED).json({
        userInfo: {
            id: user._id,
            firstName,
            lastName,
            email,
            friends: [],
            friendRequestSent: [],
            friendRequestReceived: [],
        },
        accessToken,
        userProfileImage,
    });
};

module.exports.loginUser = async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        throw new BadRequestError(
            "The server could not process your request because it contained invalid or incomplete data. Please check your inputs and try again."
        );
    }

    const user = await User.findOne({ email }).select("+pwd");

    if (!user) {
        throw new UnAuthenticatedError("Incorrect email or password.");
    }

    const isPasswordCorrect = await user.comparePassword(pwd);

    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Incorrect email or password.");
    }

    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);

    // Updating the refreshToken of the logged in user. This will not trigger the pre-save hook in the User model and will only trigger the validation of the refreshToken property.
    user.refreshToken = refreshToken;
    user.markModified("refreshToken"); // indicate that refreshToken has been modified
    const result = await user.save({ validateModifiedOnly: true }); // validate only modified fields

    // Cookie is sent for every request, however httpOnly is secured because JS can't access it
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    // // Use this instead when testing over network
    // res.cookie("jwt", refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000,
    // });

    res.status(StatusCodes.OK).json({
        userInfo: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            friends: user.friends,
            friendRequestSent: user.friendRequestSent,
            friendRequestReceived: user.friendRequestReceived,
        },
        accessToken,
        userProfileImage: user.userProfileImage,
    });
};

module.exports.logoutUser = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
        // If there's no such user in the db with that refreshToken that we got but the client has cookie named 'jwt' we clear that anyway
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    // Delete the refreshToken of the user in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(StatusCodes.NO_CONTENT);
};
