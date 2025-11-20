// routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// KEEP ONLY ONE USER MODEL IMPORT
import User from "../models/userModel.js";

import Otp from "../models/Otp.js";

const router = express.Router();

/**
 * POST /api/users/reset-password
 * body: { phone, password }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res
        .status(400)
        .json({ success: false, message: "Phone and new password required" });

    const otpDoc = await Otp.findOne({ phone, verified: true }).sort({
      createdAt: -1,
    });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not verified or expired" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = password;
    await user.save();

    await Otp.deleteMany({ phone });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// generate token
const generateToken = (id, days = "7d") =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: days });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (phone) {
      const existingByPhone = await User.findOne({ phone });
      if (existingByPhone) {
        return res
          .status(400)
          .json({ message: "User with this phone already exists" });
      }
    }

    let hashed = password;
    if (!User.schema.methods?.matchPassword) {
      const salt = await bcrypt.genSalt(10);
      hashed = await bcrypt.hash(password, salt);
    }

    const user = await User.create({ name, email, phone, password: hashed });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id, "30d"),
    });
  } catch (err) {
    console.error("REGISTER error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, email, password } = req.body;

    const identifier = emailOrPhone || email;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "emailOrPhone (or email) and password are required",
      });
    }

    const user =
      (await User.findOne({ email: identifier })) ||
      (await User.findOne({ phone: identifier }));

    if (!user) return res.status(404).json({ message: "User not found" });

    let passwordMatches = false;

    if (User.schema.methods?.matchPassword) {
      passwordMatches = await user.matchPassword(password);
    } else {
      passwordMatches = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Other routes remain same...

// Controller import
import { getUsers } from "../controllers/userController.js";

router.get("/", getUsers);

export default router;
