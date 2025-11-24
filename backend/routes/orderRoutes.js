
// backend/routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import DeliveryAgent from "../models/DeliveryAgent.js";
import authDelivery from "../middleware/authDelivery.js";

import { auth, isAdmin, isDelivery } from "../middleware/auth.js";


import shortid from "shortid";

import { generateInvoicePdf } from "../utils/invoiceGenerator.js";
import { sendOrderEmail } from "../utils/mailer.js";




const router = express.Router();
router.post("/delivery/location", authDelivery, async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location missing" });
  }

  req.delivery.currentLocation = { lat, lng };
  await req.delivery.save();

  res.json({ message: "Location updated" });
});

/* ------------------------------
   CREATE NEW ORDER
------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { user, items, subtotal, shipping, tax, total, paymentMethod } = req.body;

    if (!user || !items?.length) {
      return res.status(400).json({ error: "User and items are required" });
    }

    const orderId = `ORD-${shortid.generate().toUpperCase()}`;

    const order = await Order.create({
      orderId,
      user,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "COD",
      status: "PLACED",
      timeline: [{ status: "PLACED", note: "Order initiated", ts: new Date() }]
    });

    // Email + Invoice
    try {
      const pdf = await generateInvoicePdf(order);
      await sendOrderEmail(
        user.email,
        `Order ${orderId} confirmed`,
        `Your order ${orderId} has been placed successfully.`,
        [{ filename: `${orderId}.pdf`, content: pdf }]
      );
    } catch (err) {
      console.log("Email failed", err);
    }

    res.status(201).json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   GET ALL ORDERS
------------------------------- */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (userId) query["user.userId"] = userId;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({ success: true, orders, total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   ORDER DETAILS
------------------------------- */
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   INVOICE DOWNLOAD
------------------------------- */
router.get("/:orderId/invoice", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const pdf = await generateInvoicePdf(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${order.orderId}.pdf`,
    });

    res.send(pdf);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   UPDATE STATUS
------------------------------- */
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status, note } = req.body;

    const allowed = ["PLACED", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    order.timeline.push({ status, note, ts: new Date() });

    await order.save();
    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   UPDATE DELIVERY TRACKING
------------------------------- */
router.post("/:orderId/track", async (req, res) => {
  try {
    const { lat, lng, assignedTo, driverPhone, etaMinutes } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.delivery = {
      ...order.delivery,
      assignedTo,
      driverPhone,
      currentLocation: lat && lng ? { lat, lng } : order.delivery?.currentLocation,
      etaMinutes: etaMinutes ?? order.delivery?.etaMinutes
    };

    await order.save();
    res.json({ success: true, delivery: order.delivery });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------
   FETCH LIVE TRACKING
------------------------------- */
router.get("/:orderId/track", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      success: true,
      orderId: order.orderId,
      status: order.status,
      timeline: order.timeline,
      delivery: order.delivery,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


import nodemailer from "nodemailer";

const OWNER_EMAIL = "vishalthakurktrr44@gmail.com";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vishalthakurktr44",
    pass: "pivv xvka ppoq hxtr"
  }
});


/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // Send email background
    sendOrderEmail(order);

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Order not created" });
  }
});

/*
|--------------------------------------------------------------------------
| SEND EMAILS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS (Admin Panel)
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER (OrderConfirmation.jsx)
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json({ success: true, order });
  } catch {
    res.status(404).json({ success: false, order: null });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/
router.put("/:id/status", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/*
|--------------------------------------------------------------------------
| MANUAL EMAIL TRIGGER (OrderConfirmation.jsx)
|--------------------------------------------------------------------------
*/
router.post("/send-confirmation-email", async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    await sendOrderEmail(order);

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ORDER TRACKING ENDPOINT
router.get("/track/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate("deliveryAgent", "name")
      .lean();

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      orderId: order.orderId,
      status: order.status,
      timeline: order.timeline,
      deliveryAgent: order.deliveryAgent,
    });
  } catch (err) {
    res.status(500).json({ error: "Track error" });
  }
});

// ADMIN: assign delivery agent
router.post("/:id/assign-delivery", auth, isAdmin, async (req, res) => {
  const { deliveryAgentId } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { deliveryAgent: deliveryAgentId },
    { new: true }
  );

  await DeliveryAgent.findByIdAndUpdate(deliveryAgentId, {
    $addToSet: { assignedOrders: order._id },
  });

  res.json({ success: true, order });
});

// DELIVERY BOY: update location
router.post("/delivery/location", auth, isDelivery, async (req, res) => {
  const { lat, lng } = req.body;

  await DeliveryAgent.findOneAndUpdate(
    { userId: req.user._id },
    {
      currentLocation: {
        lat,
        lng,
        updatedAt: new Date(),
      },
    }
  );

  res.json({ success: true });
});

// DELIVERY BOY: orders assigned to him
router.get("/delivery/my-orders", auth, isDelivery, async (req, res) => {
  const agent = await DeliveryAgent.findOne({ userId: req.user._id }).populate(
    "assignedOrders"
  );

  res.json({ orders: agent?.assignedOrders || [] });
});
// PUT /api/orders/delivery/update-status
router.put("/delivery/update-status", async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) return res.json({ success: false, msg: "Order not found" });

    order.status = status;

    if (status === "Delivered") {
      order.deliveredDate = new Date();
    }

    await order.save();

    res.json({ success: true, msg: "Status updated", order });
  } catch (e) {
    res.json({ success: false, msg: "Error", error: e });
  }
});
router.post("/delivery/location", authDelivery, async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.json({ success: false, msg: "Lat/Lng missing" });
    }

    await DeliveryBoy.updateOne(
      { _id: deliveryBoyId },
      { $set: { liveLocation: { lat, lng, updatedAt: Date.now() } } }
    );

    res.json({ success: true, msg: "Location updated" });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});
router.get("/delivery/my-orders", authDelivery, async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user.id
    });

    res.json({ success: true, orders });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});
router.put("/delivery/update-status", authDelivery, async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, msg: "Missing fields" });
    }

    const order = await Order.findOne({ orderId });

    if (!order) return res.json({ success: false, msg: "Order not found" });

    if (order.deliveryBoy.toString() !== req.user.id) {
      return res.json({ success: false, msg: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, msg: "Status updated", order });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});
router.get("/track/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate("deliveryBoy", "liveLocation name phone");

    if (!order) {
      return res.json({ success: false, msg: "Order not found" });
    }

    if (!order.deliveryBoy?.liveLocation) {
      return res.json({ success: false, msg: "Live location not updated yet" });
    }

    res.json({
      success: true,
      deliveryBoy: {
        name: order.deliveryBoy.name,
        phone: order.deliveryBoy.phone,
        location: order.deliveryBoy.liveLocation
      }
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});
router.get("/analytics/heatmap", auth, isAdmin, async (req, res) => {
  // logic here
});

router.get("/analytics/top-cities", auth, isAdmin, async (req, res) => {
  // logic here
});

export default router;
