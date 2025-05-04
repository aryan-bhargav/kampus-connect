const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoute.js");
const locationRoutes = require("./routes/locationRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const getUserRoute = require("./routes/getUserRoute.js");

dotenv.config();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/getUser", getUserRoute);
app.use("/api/location", locationRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000, // Optional: Helps manage reconnection
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("updateLocation", (locationData) => {
    io.emit("locationUpdated", locationData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
