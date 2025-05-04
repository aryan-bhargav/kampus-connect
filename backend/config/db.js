const mongoose = require("mongoose")
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL =process.env.MONGODB_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB..")
    } catch (error) {
        console.log("Failed to Connect MongoDB..")
    }
}

module.exports = connectDB;