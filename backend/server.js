
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import http from "http";
import { Server as IOServer } from "socket.io";
import fs from "fs";
import connectDB from "./config/db.js";

// Import routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();

// ==================== DB ====================
connectDB();

// ==================== FIX: CREATE UPLOAD FOLDERS ====================

app.use("/uploads", express.static("uploads"));

// ==================== CORS ====================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ==================== BODY PARSER ====================
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ==================== STATIC FILES ====================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/checkout", checkoutRoutes);

// ==================== ROOT ROUTE ====================
app.get("/", (req, res) => {
  res.send("🚀 Backend API Running...");
});

// ==================== FAST2SMS OTP ====================
app.post("/api/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {},
      {
        headers: { authorization: process.env.FAST2SMS_API_KEY },
        params: {
          route: "v3",
          sender_id: "TXTIND",
          message: `Your OTP is ${otp}`,
          language: "english",
          numbers: phone,
        },
      }
    );

    res.json({ success: true, otp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "OTP sending failed" });
  }
});

// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// ==================== SOCKET.IO ====================
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "*" },
});
app.locals.io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("joinOrderRoom", (orderId) => {
    socket.join(orderId);
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
