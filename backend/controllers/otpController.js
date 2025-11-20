import axios from "axios";
import twilio from "twilio";
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";

/* ---------------------------------------------------------
   TEMPORARY IN-MEMORY EMAIL OTP STORE
----------------------------------------------------------*/
const emailOtpStore = {};

/* ---------------------------------------------------------
   📧 SEND EMAIL OTP
----------------------------------------------------------*/
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    emailOtpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your EasyShop Email OTP",
      text: `Your OTP is ${otp}`,
    });

    console.log(`📧 Email OTP for ${email}: ${otp}`);

    return res.json({ success: true, message: "Email OTP sent successfully" });
  } catch (error) {
    console.error("Email OTP error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send email OTP" });
  }
};

/* ---------------------------------------------------------
   📧 VERIFY EMAIL OTP
----------------------------------------------------------*/
export const verifyEmailOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ success: false, message: "Email and OTP are required" });

  if (!emailOtpStore[email])
    return res.status(400).json({ success: false, message: "No OTP sent to this email" });

  if (emailOtpStore[email] === otp.toString()) {
    delete emailOtpStore[email];
    return res.json({ success: true, message: "Email OTP verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
};

/* ---------------------------------------------------------
   🔐 INIT TWILIO CLIENT
----------------------------------------------------------*/
let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

/* ---------------------------------------------------------
   📱 SEND SMS OTP
----------------------------------------------------------*/
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone)
      return res.json({ success: false, message: "Phone number required" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP in MongoDB
    await Otp.create({ phone, otp });

    /* ---------------------------------------
       PRIORITY 1: TWILIO
    -----------------------------------------*/
    if (process.env.TWILIO_ENABLED === "true" && client) {
      await client.messages.create({
        body: `Your EasyShop OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      });

      console.log(`📱 OTP via Twilio: ${otp}`);
    }

    /* ---------------------------------------
       PRIORITY 2: FAST2SMS
    -----------------------------------------*/
    else if (process.env.FAST2SMS_API_KEY) {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {},
        {
          headers: { authorization: process.env.FAST2SMS_API_KEY },
          params: {
            sender_id: "TXTIND",
            message: `Your EasyShop OTP is ${otp}`,
            route: "v3",
            numbers: phone,
          },
        }
      );

      console.log(`📱 OTP via Fast2SMS: ${otp}`);
    }

    /* ---------------------------------------
       PRIORITY 3: CONSOLE (TEST MODE)
    -----------------------------------------*/
    else {
      console.log(`📱 TEST OTP for ${phone}: ${otp}`);
    }

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("SMS OTP error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

/* ---------------------------------------------------------
   📱 VERIFY SMS OTP
----------------------------------------------------------*/
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });

    const record = await Otp.findOne({ phone, otp });

    if (!record)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};
