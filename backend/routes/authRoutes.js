// routes/authRoutes.js
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

/**
 * NOTE:
 * - This file uses a simple in-memory otpStore for demo/dev.
 * - For production use, persist OTPs in DB with expiry (see earlier Otp model suggestion).
 */

// Twilio client (optional — only used if TWILIO env vars set)
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn("Twilio init failed:", err.message);
  }
}

// Simple in-memory OTP store: { "<phone>": { otp: "123456", createdAt: Date } }
const otpStore = {};

// Helper: create JWT
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "changeme", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/* ---------------------------
   Register (email/phone)
   POST /api/auth/register
   Body: { firstName, lastName, email?, phone?, password }
---------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ success: false, message: "Provide password and either email or phone" });
    }

    if (email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: "Email already in use" });
    }
    if (phone) {
      const existing = await User.findOne({ phone });
      if (existing) return res.status(400).json({ success: false, message: "Phone already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, phone, password: hashed });
    await user.save();

    const token = createToken(user);
    res.json({
      success: true,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Email signup (alias for register)
   POST /api/auth/signup
   Body: { firstName, lastName, email, password, phone? }
---------------------------- */
router.post("/signup", async (req, res) => {
  // Keep as alias for register to support older frontend naming
  return router.handle(req, res, () => { });
});

/* ---------------------------
   Login
   POST /api/auth/login
   Body: { emailOrPhone, password }
---------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) return res.status(400).json({ success: false, message: "Missing credentials" });

    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      success: true,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Send OTP (Twilio optional)
   POST /api/auth/send-otp
   Body: { phone }
---------------------------- */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = { otp, createdAt: Date.now() };

    // Send via Twilio if configured
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your FreshCart OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      } catch (smsErr) {
        console.warn("Twilio send failed:", smsErr.message);
        // continue — OTP is stored, return success for dev
      }
    } else {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
    }

    return res.json({ success: true, message: "OTP generated and sent (if SMS configured)" });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Verify OTP
   POST /api/auth/verify-otp
   Body: { phone, otp }
---------------------------- */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone and OTP required" });

    const record = otpStore[phone];
    if (!record) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    // Expire after 5 minutes (300000 ms)
    if (Date.now() - record.createdAt > 5 * 60 * 1000) {
      delete otpStore[phone];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP ok — delete and (optionally) create/verify user
    delete otpStore[phone];

    // If user exists, mark as verified
    const user = await User.findOne({ phone });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    // Create token if user exists, else return success so frontend can continue signup flow
    if (user) {
      const token = createToken(user);
      return res.json({ success: true, message: "Phone verified", token });
    } else {
      return res.json({ success: true, message: "Phone verified" });
    }
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Forgot password (sends OTP)
   POST /api/auth/forgot-password
   Body: { phone }
---------------------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    // Reuse send-otp logic (store OTP)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = { otp, createdAt: Date.now() };

    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your password reset OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      } catch (smsErr) {
        console.warn("Twilio send failed:", smsErr.message);
      }
    } else {
      console.log(`[DEV] Password reset OTP for ${phone}: ${otp}`);
    }

    return res.json({ success: true, message: "OTP sent for password reset" });
  } catch (err) {
    console.error("forgot-password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Reset password
   POST /api/auth/reset-password
   Body: { phone, password }
   Requirement: OTP must have been verified via verify-otp recently (for production use DB check).
   Here for simplicity we accept if an OTP was generated and not expired and assumed verified.
---------------------------- */
router.post("/reset-password", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, message: "Phone and new password required" });

    // Basic check: ensure there was a recent OTP generation (in-memory)
    const otpRecord = otpStore[phone];
    if (!otpRecord || Date.now() - otpRecord.createdAt > 5 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "OTP not verified or expired (use verify-otp first)" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    // remove otp record after reset
    delete otpStore[phone];

    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("reset-password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Refresh token (simple implementation)
   POST /api/auth/refresh
   Body: { token } (optional; here we simply re-issue if token is valid)
---------------------------- */
router.post("/refresh", (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ success: false, message: "Token required" });

    jwt.verify(token, process.env.JWT_SECRET || "changeme", (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: "Invalid token" });
      const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || "changeme", { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
      return res.json({ success: true, token: newToken });
    });
  } catch (err) {
    console.error("refresh error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------------
   Logout (client-side token removal usually sufficient)
   POST /api/auth/logout
---------------------------- */
router.post("/logout", (_req, res) => {
  // For stateless JWT, logout is handled client-side by discarding token.
  // Server can implement token blacklist if required.
  res.json({ success: true, message: "Logged out" });
});

export default router;
