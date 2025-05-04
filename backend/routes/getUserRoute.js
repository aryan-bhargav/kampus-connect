// backend/routes/getUser.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is in cookies

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Decode and verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object (e.g., email)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// API to get user data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user; // Extract email from the decoded token
    const user = await User.findOne({ email });

    // If no user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive information (like password) from the response
    const { password, ...userData } = user.toObject();
    
    // Send the user data (e.g., name, college, branch, section) back to frontend
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
