// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

/* ---------------------------------------------------------
   REGISTER (Email + Password)
--------------------------------------------------------- */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Registration successful",
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   LOGIN (Email + Password)
--------------------------------------------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token: accessToken,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   FORGOT PASSWORD
--------------------------------------------------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000;

    user.passwordReset = { tokenHash, expiresAt };
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;

    await sendEmail(
      user.email,
      "Password Reset",
      link,
      `<a href="${link}">Reset Password</a>`
    );

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   RESET PASSWORD
--------------------------------------------------------- */
export const resetPassword = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user || !user.passwordReset)
      return res.status(400).json({ message: "Invalid request" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    if (tokenHash !== user.passwordReset.tokenHash)
      return res.status(400).json({ message: "Invalid token" });

    if (Date.now() > user.passwordReset.expiresAt)
      return res.status(400).json({ message: "Token expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordReset = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   REFRESH TOKEN
--------------------------------------------------------- */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const access = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const newRefresh = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = newRefresh;
    await user.save();

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: access });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

/* ---------------------------------------------------------
   LOGOUT
--------------------------------------------------------- */
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  }
};
