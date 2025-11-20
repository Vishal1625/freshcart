// controllers/orderController.js
import Order from "../models/Order.js";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

// Generate orderId for invoice tracking
const generateOrderId = () => "ORD-" + Math.floor(100000 + Math.random() * 900000);

// =========================================================
// 1. PLACE ORDER  (Unified API for COD / UPI / Online Payments)
// =========================================================
export const placeOrder = async (req, res) => {
  try {
    const {
      user,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      deliverySlot,
      deliveryInstruction,
      email,
    } = req.body;

    const orderId = generateOrderId();
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

    const newOrder = await Order.create({
      orderId,
      user,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentStatus,
      deliverySlot,
      deliveryInstruction,
      status: "Order Placed",
      timeline: [{ status: "Order Placed", time: new Date() }],
      email,
    });

    // send confirmation email asynchronously if email present
    if (email) {
      sendOrderEmail(email, newOrder).catch((e) =>
        console.error("sendOrderEmail error:", e)
      );
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order placement failed", error });
  }
};

// =========================================================
// 2. GET ALL ORDERS
// =========================================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================
// 3. GET ORDER BY ID (single)
// =========================================================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================
// 4. UPDATE ORDER STATUS (Admin OR Real-time tracking)
// =========================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        status,
        $push: {
          timeline: { status, note, time: new Date() },
        },
      },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // emit realtime update if socket available
    if (req.app?.locals?.io) {
      req.app.locals.io.to(orderId).emit("orderUpdated", order);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================
// 5. DOWNLOAD PDF INVOICE
// =========================================================
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) return res.status(404).send("Order not found");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(22).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Order ID: ${order.orderId}`);
    if (order.createdAt) doc.text(`Date: ${order.createdAt.toDateString()}`);
    if (order.paymentMethod || order.paymentStatus)
      doc.text(`Payment: ${order.paymentMethod || "-"} (${order.paymentStatus || "-"})`);
    doc.moveDown();

    doc.text("Billing Address:");
    if (order.user?.name) doc.text(order.user.name);
    if (order.user?.address) doc.text(order.user.address);
    doc.moveDown();

    doc.fontSize(16).text("Items:");
    (order.items || []).forEach((item) => {
      doc.text(`${item.name} x${item.qty} - ₹${(item.price || 0) * (item.qty || 0)}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${order.subtotal || 0}`);
    doc.text(`Shipping: ₹${order.shipping || 0}`);
    doc.text(`Tax: ₹${order.tax || 0}`);
    doc.text(`Total: ₹${order.total || 0}`);

    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).send("Failed to generate invoice");
  }
};

// =========================================================
// 6. TRACK ORDER (Customer tracking page)
// =========================================================
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tracking failed" });
  }
};

// =========================================================
// 7. SEND CONFIRMATION EMAIL (utility)
// =========================================================
export const sendOrderEmail = async (toEmail, order) => {
  try {
    if (!toEmail || !order) return;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true" || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>Your Order is Confirmed!</h2>
      <p>Order ID: <strong>${order.orderId}</strong></p>
      <p>Total Amount: <strong>₹${order.total}</strong></p>
      <p>We will notify you when your order status updates.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html,
    });

    console.log("Email sent to:", toEmail);
  } catch (error) {
    console.error("Email error:", error?.message || error);
  }
};
import Order from '../models/Order.js'


export const getOrders = async (req, res) => {
  const orders = await Order.find()
  res.json(orders)
}
export const createOrder = async (req, res) => {
  const o = await Order.create(req.body)
  res.json(o)
}
export const updateOrder = async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(o)
}