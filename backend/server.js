const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initializeDb } = require("./db");
const { initializeUserTable } = require("./models/user");
const weatherRoutes = require("./routes/weather");
const authRoutes = require("./routes/auth");
require("dotenv").config();

// MQTT broker dependencies
const aedes = require("aedes")();
const net = require("net");
const WebSocket = require("ws");

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
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/weather", weatherRoutes);
app.use("/api/auth", authRoutes);

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

// MQTT Broker setup
const TCP_PORT = process.env.MQTT_PORT || 1883; // For Arduino
const WS_PORT = process.env.MQTT_WS_PORT || 8888; // For Frontend (WebSocket)

// MQTT TCP server
const mqttServer = net.createServer(aedes.handle);
mqttServer.listen(TCP_PORT, () => {
  console.log(`🚀 MQTT broker (TCP) listening on port ${TCP_PORT}`);
});

// MQTT WebSocket server
const httpWsServer = http.createServer();
const wsServer = new WebSocket.Server({ server: httpWsServer });

wsServer.on("connection", (ws) => {
  const stream = WebSocket.createWebSocketStream(ws);
  aedes.handle(stream);
});

httpWsServer.listen(WS_PORT, () => {
  console.log(`🌐 MQTT broker (WebSocket) listening on port ${WS_PORT}`);
});

// MQTT event logging
aedes.on("client", (client) => {
  console.log(`✅ MQTT Client connected: ${client ? client.id : client}`);
});

aedes.on("clientDisconnect", (client) => {
  console.log(`❌ MQTT Client disconnected: ${client ? client.id : client}`);
});

aedes.on("publish", (packet, client) => {
  if (client) {
    console.log(
      `📩 MQTT Message published by ${client.id} on topic ${
        packet.topic
      }: ${packet.payload.toString()}`
    );
  }
});

// Start HTTP server
const PORT = process.env.PORT || 3001;
async function startServer() {
  try {
    // Initialize database first
    await initializeDb();

    // Initialize user table
    await initializeUserTable();

    // Then start the Express server
    server.listen(PORT, () => {
      console.log(`🌦️ Weather API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
