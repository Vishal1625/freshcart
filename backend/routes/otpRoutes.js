import express from "express";
import twilio from "twilio";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { sendEmailOtp, verifyEmailOtp } from "../controllers/otpEmailController.js";
import { nanoid } from "nanoid";
import Otp from "../models/Otp.js";
import axios from "axios";

const router = express.Router();
const orderId = `ORD-${nanoid(8).toUpperCase()}`;

/* --------------------------------------------
   📱 LOCAL OTP (Your custom controller)
---------------------------------------------*/
router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

/* --------------------------------------------
   📧 EMAIL OTP (Nodemailer)
---------------------------------------------*/
router.post("/send-email", sendEmailOtp);
router.post("/verify-email", verifyEmailOtp);

/* --------------------------------------------
   📞 TWILIO OTP (Verify API)
---------------------------------------------*/
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

// SEND OTP via Twilio
router.post("/auth/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number required" });
  }

  try {
    const sms = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phone.startsWith("+91") ? phone : `+91${phone}`,
        channel: "sms",
      });

    res.json({ success: true, status: sms.status });
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// VERIFY OTP via Twilio
router.post("/auth/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Phone & OTP required" });

  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phone.startsWith("+91") ? phone : `+91${phone}`,
        code: otp,
      });

    if (verification.status === "approved") {
      return res.json({ success: true, message: "OTP verified successfully" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  } catch (err) {
    console.error("❌ OTP verify error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------
   📱 BACKUP LOCAL OTP (DB Based)
   This replaces the duplicate definitions
---------------------------------------------*/
router.post("/local/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ phone, otp, verified: false });

    if (process.env.FAST2SMS_API_KEY) {
      try {
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
      } catch (err) {
        console.warn("Fast2SMS failed:", err.message);
      }
    } else {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
    }

    return res.json({
      success: true,
      message: "OTP generated (SMS sent if configured)",
    });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOCAL DB OTP VERIFY
router.post("/local/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Phone and OTP required" });

    const doc = await Otp.findOne({ phone, otp }).sort({ createdAt: -1 });
    if (!doc)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });

    doc.verified = true;
    await doc.save();

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
