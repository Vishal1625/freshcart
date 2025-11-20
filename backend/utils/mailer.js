import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmail(to, subject, text, attachments = []) {
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    text,
    attachments,
  };
  return transporter.sendMail(mailOptions);
}
export async function sendWelcomeEmail(to, name) {
  const subject = "Welcome to fresh cart!";
  const text = `Hi ${name},\n\nThank you for registering at fresh cart. We're excited to have you on board!\n\nBest regards,\nfresh cart Team`;
  return sendOrderEmail(to, subject, text);
}