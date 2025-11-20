// backend/models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String }, // optional (email OTP)
  phone: { type: String, required: true }, // optional (SMS OTP)
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  // Auto-delete after 5 minutes
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 300 seconds = 5 minutes
  },
});
const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default Otp;
