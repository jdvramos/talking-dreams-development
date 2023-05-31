const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const NAME_REGEX = /^[a-zA-Z]{2,50}( [a-zA-Z]{0,49}[a-zA-Z])? *$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide your first name."],
            minlength: 2,
            maxlength: 50,
            validate: {
                validator: function (v) {
                    return NAME_REGEX.test(v);
                },
                message:
                    "First name must consist of 2-50 alphabetic characters only.",
            },
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Please provide your last name."],
            minlength: 2,
            maxlength: 50,
            validate: {
                validator: function (v) {
                    return NAME_REGEX.test(v);
                },
                message:
                    "Last name must consist of 2-50 alphabetic characters only.",
            },
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email address."],
            validate: {
                validator: validator.isEmail,
                message: "Email address must be valid.",
            },
            unique: true,
        },
        pwd: {
            type: String,
            required: [true, "Please provide your password."],
            minlength: 8,
            validate: {
                validator: function (v) {
                    return PWD_REGEX.test(v);
                },
                message:
                    "The password you provided is invalid. Password must contain 8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: ! @ # $ %.",
            },
            select: false,
        },
        userProfileImage: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // friendRequestSent: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "User",
        //     },
        // ],
        // friendRequestReceived: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "User",
        //     },
        // ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths());

    if (!this.isModified("pwd")) return;
    const salt = await bcrypt.genSalt(10);
    this.pwd = await bcrypt.hash(this.pwd, salt);
});

// The bcrypt.compare returns true if passwords are matched
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.pwd);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
