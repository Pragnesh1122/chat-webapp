const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Middleware
app.use(cors());

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.io instance and attach it to the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow origin from React app
    methods: ["GET", "POST"] // Allow GET and POST requests
  }
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle joining a room
  socket.on("join_room", (data) => {
    socket.join(data); // Join the specified room
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data); // Broadcast message to room
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start the server and listen on port 3001
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
