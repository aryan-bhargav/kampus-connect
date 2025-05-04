const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Location", LocationSchema);
