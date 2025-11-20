// backend/utils/emailOtp.js
import nodemailer from "nodemailer";

export const sendOtpToEmail = async (email, otp) => {
  try {
    // Create a transporter using Gmail or your SMTP service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER || "youremail@gmail.com", // replace or use env vars
        pass: process.env.SMTP_PASS || "your-app-password",
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER || "youremail@gmail.com",
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    throw error;
  }
};
