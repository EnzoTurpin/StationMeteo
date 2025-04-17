const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { initializeDb } = require("./db");
const weatherRoutes = require("./routes/weather");
require("dotenv").config();

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store socket.io instance
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/weather", weatherRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Weather Station API" });
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
async function startServer() {
  try {
    // Initialize database first
    await initializeDb();

    // Then start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
