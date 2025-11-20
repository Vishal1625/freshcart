

import nodemailer from "nodemailer";

const emailOtpStore = {}; // Temporary in-memory store (use DB in production)

// ✅ Send Email OTP
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

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
      subject: "Your EasyShop OTP Code",
      text: `Your OTP is ${otp}`,
    });

    console.log(`📧 Email OTP sent to ${email}: ${otp}`);
    return res.json({ success: true, message: "Email OTP sent successfully" });
  } catch (error) {
    console.error("Email OTP error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email OTP" });
  }
};

// ✅ Verify Email OTP
export const verifyEmailOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP required" });

  if (!emailOtpStore[email])
    return res
      .status(400)
      .json({ success: false, message: "No OTP sent to this email" });

  if (emailOtpStore[email] === otp.toString()) {
    delete emailOtpStore[email];
    return res.json({ success: true, message: "Email OTP verified successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP" });
  }
};
