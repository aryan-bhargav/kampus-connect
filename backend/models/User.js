const mongoose = require("mongoose"); 
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        college: { type: String, required: true, index: true },
        branch: { type: String, required: true, index: true },
        section: { type: String, required: true, index: true },

        username: {
            type: String,
            unique: true,
            sparse: true, // Allows users without a username
            match: [/^[a-zA-Z0-9_.]+$/, "Invalid username format"], // Allows only letters, numbers, _ and .
        },

        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        friendRequests: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                status: { type: String, enum: ["pending", "accepted"], default: "pending" },
            },
        ],
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);