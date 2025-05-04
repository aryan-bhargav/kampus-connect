const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// Update or Add User Location
router.post("/", async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;

        if (!userId || !latitude || !longitude) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user location already exists
        let userLocation = await Location.findOne({ user: userId });

        if (userLocation) {
            // Update existing location
            userLocation.latitude = latitude;
            userLocation.longitude = longitude;
            userLocation.updatedAt = new Date();
            await userLocation.save();
        } else {
            // Create new location entry
            userLocation = new Location({ user: userId, latitude, longitude });
            await userLocation.save();
        }

        res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get Nearby Users (For now, return all except requester)
router.get("/nearby", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch users excluding the requester
        const nearbyUsers = await Location.find({ user: { $ne: userId } }).populate("user", "name username");

        res.status(200).json(nearbyUsers);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
