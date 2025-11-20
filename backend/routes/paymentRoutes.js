
import express from "express";
import crypto from "crypto";
import { razorpayInstance } from "../utils/payment.js";

const router = express.Router();

// ✅ Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error.message);
    res.status(500).json({ success: false, error: "Payment order creation failed" });
  }
});

// ✅ Verify Payment Signature
router.post("/verify", (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error.message);
    res.status(500).json({ success: false, error: "Payment verification error" });
  }
});

export default router;
