import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import passport from "./src/config/passport";
import "./src/models/connectDB";

import authRoutes from "./src/routes/auth";
import roleRoutes from "./src/routes/role";
import categoryRoutes from "./src/routes/category";
import productRoutes from "./src/routes/product";
import cartProductRouter from "./src/routes/cartProduct";
import cartRouter from "./src/routes/cart";
import permissionRoutes from "./src/routes/permission";
import rolePermissionRoutes from "./src/routes/rolePermission";
import favoriteRouter from "./src/routes/favorite";

import locationsRouter from "./src/routes/location";


import dashboardRoutes from "./src/routes/dashboard";

// --- SOCKET.IO SETUP ---
import { createServer } from "http";
import { Server } from "socket.io";

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // When a user or admin joins a room
  socket.on("join-room", ({ roomId, isAdmin }) => {
    socket.join(roomId);
    console.log(`🟢 Joined room: ${roomId}`);

    // If it's an admin, also join the special "admin-room"
    if (isAdmin) {
      socket.join("admin-room");
      console.log("👑 Admin joined admin-room");
    }
  });

  // When a message is sent
  socket.on("send-message", ({ roomId, message, sender }) => {
    if (sender === "user") {
      // Send the message to the user room (so user sees their message)
      io.to(roomId).emit("receive-message", { sender, message });

      // Send the message to the admin room so admins can see it
      io.to("admin-room").emit("receive-message", {
        sender: `User (${roomId})`,
        message,
        roomId,
      });
    }

    if (sender === "admin") {
      // Admin replies only to specific user room
      io.to(roomId).emit("receive-message", {
        sender: "admin",
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- API ROUTES ---
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/cartProduct", cartProductRouter);
app.use("/api/permissions", permissionRoutes);
app.use("/api/rolePermissions", rolePermissionRoutes);
app.use("/api/favorite", favoriteRouter);

app.use("/api/location", locationsRouter);


app.use("/api/dashboard", dashboardRoutes);

// --- DEFAULT ROUTE ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- START SERVER ---
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
});
