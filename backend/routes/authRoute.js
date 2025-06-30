const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
dotenv.config();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const secretkey = process.env.JWT_SECRET;
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, college, branch, section } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists, please signin" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, college, branch, section });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, secretkey, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // Must be true on HTTPS (Render)
      sameSite: "None",    // Allows cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/colleges", async (req, res) => {
  try {
    const db = mongoose.connection;
    const colleges = await db.collection("collegeList").find({}, { projection: { name: 1, _id: 0 } }).toArray();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/branches", async (req, res) => {
  try {
    const db = mongoose.connection;
    const branchData = await db.collection("branches").findOne({});
    const branches = branchData.branches;
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, secretkey, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // Must be true on HTTPS (Render)
    sameSite: "None",    // Allows cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login successful" });
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0), // Expire immediately
  });
  res.json({ message: "Logout successful" });
});

module.exports = router;
