const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



// 🔍 Search users by name or email
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { username, college, branch } = req.query;

    // Build a dynamic search filter
    let filter = {};

    if (username) {
      filter.username = { $regex: username.trim(), $options: "i" };
    }
    if (college) {
      filter.college = { $regex: college.trim(), $options: "i" };
    }
    if (branch) {
      filter.branch = { $regex: branch.trim(), $options: "i" };
    }

    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "At least one search parameter required" });
    }

    const users = await User.find(filter).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// 📩 Send friend request
router.post("/friend-request/:id", async (req, res) => {
  try {
    const senderId = req.body.senderId;  // Get senderId from the request body
    const receiverId = req.params.id;    // Get receiverId from the URL parameter

    // Check if senderId and receiverId are provided
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender and receiver IDs are required" });
    }

    // Check if senderId is the same as receiverId (no self requests)
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    // Find the receiver by receiverId
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    // Check if the friend request was already sent
    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add senderId to receiver's friendRequests list
    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.json({ message: "Friend request sent saccessfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// ✅ Accept friend request
router.post("/accept-request/:id", async (req, res) => {
  try {
    const receiverId = req.user._id;
    const senderId = req.params.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) return res.status(404).json({ message: "User not found" });

    if (!receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "No friend request found from this user" });
    }

    // Add each other as friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    // Remove request from pending list
    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🤝 Get suggested friends (Users who are not already friends and not requested)
router.get("/suggested-friends", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user to get their current friends and pending requests
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Exclude the user's own ID, current friends, and pending requests
    const excludedIds = [userId, ...user.friends, ...user.friendRequests];

    // Find users who are not in the excluded list
    const suggestedFriends = await User.find({ _id: { $nin: excludedIds } })
      .select("name email username");

    res.json(suggestedFriends);
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Get Friends & Friend Requests
router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "username email") // Populate friends
      .populate("friendRequests", "username email"); // Populate friend requests directly

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests, // No need to map, already populated
    });
  } catch (error) {
    console.error("🔥 Error fetching friends:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Check Username Availability
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.length < 3 || username.length > 15) {
      return res.status(400).json({ message: "Username must be 3-15 characters long." });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    res.json({ message: "Username is available." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// 👤 Get user profile (fetch username)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.username || "Not Set" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✏️ Update Username
router.put("/update-username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;
    console.log("Received username:", username);

    const userId = req.user.id;

    if (!username || username.length < 3 || username.length > 15) {
      return res.status(400).json({ message: "Username must be 3-15 characters long." });
    }

    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      return res.status(400).json({ message: "Only letters, numbers, _ and . are allowed." });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Update username
    const user = await User.findByIdAndUpdate(userId, { username: username.trim() }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Username updated successfully.", username: user.username });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.options("/update-username", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

module.exports = router;
