import Address from "../models/Address.js";
import DeliveryInstruction from "../models/DeliveryInstruction.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Order from "../models/Order.js";

/* =====================================================
   SAVE ADDRESS
===================================================== */
export const saveAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID and address are required" });
    }

    // Remove old default address
    if (address.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const saved = await Address.create({ userId, ...address });

    return res.json({ success: true, address: saved });
  } catch (err) {
    console.error("SAVE ADDRESS ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to save address",
      error: err.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveredDate } = req.body;
    const { id } = req.params;

    const updateData = { status };
    if (deliveredDate) updateData.deliveredDate = deliveredDate;

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });

    return res.json({ success: true, order: updated });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return res.status(500).json({ success: false, msg: "Failed to update status" });
  }
};


/* =====================================================
   GET ALL ADDRESSES
===================================================== */
export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });

    const list = await Address.find({ userId }).sort({ isDefault: -1 });

    return res.json({ success: true, addresses: list });
  } catch (err) {
    console.error("GET ADDRESSES ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to load addresses",
      error: err.message,
    });
  }
};

/* =====================================================
   DELETE ADDRESS
===================================================== */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId)
      return res
        .status(400)
        .json({ success: false, msg: "Address ID is required" });

    await Address.findByIdAndDelete(addressId);

    return res.json({ success: true, msg: "Address deleted" });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Delete failed",
      error: err.message,
    });
  }
};

/* =====================================================
   SAVE DELIVERY INSTRUCTION
===================================================== */
export const saveInstruction = async (req, res) => {
  try {
    const { userId, instruction } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });

    const saved = await DeliveryInstruction.findOneAndUpdate(
      { userId },
      { instruction },
      { upsert: true, new: true }
    );

    return res.json({ success: true, instruction: saved });
  } catch (err) {
    console.error("SAVE INSTRUCTION ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to save instruction",
      error: err.message,
    });
  }
};

/* =====================================================
   SAVE DELIVERY SLOT
===================================================== */
export const saveDeliverySlot = async (req, res) => {
  try {
    const { userId, slot } = req.body;

    if (!userId || !slot)
      return res.status(400).json({
        success: false,
        msg: "User ID and delivery slot are required",
      });

    // If you want to save slot to DB → Add a model  
    // Example (Uncomment if slot model exists):
    // await DeliverySlot.findOneAndUpdate(
    //   { userId },
    //   { slot },
    //   { upsert: true, new: true }
    // );

    return res.json({
      success: true,
      msg: "Delivery slot saved",
      slot,
    });
  } catch (err) {
    console.error("SAVE DELIVERY SLOT ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to save delivery slot",
      error: err.message,
    });
  }
};

/* =====================================================
   SAVE PAYMENT METHOD
===================================================== */
export const savePaymentMethod = async (req, res) => {
  try {
    const { userId, method } = req.body;

    if (!userId || !method)
      return res.status(400).json({
        success: false,
        msg: "User ID and payment method are required",
      });

    const saved = await PaymentMethod.findOneAndUpdate(
      { userId },
      { method },
      { upsert: true, new: true }
    );

    return res.json({ success: true, payment: saved });
  } catch (err) {
    console.error("SAVE PAYMENT METHOD ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Payment update failed",
      error: err.message,
    });
  }
};

/* =====================================================
   PLACE ORDER (FULLY FIXED)
===================================================== */
export const placeOrder = async (req, res) => {
  try {
    console.log("Incoming Order Payload:", req.body);

    const {
      userId,
      items,
      paymentInfo,
      address,
      instruction,
      totalAmount,
    } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "User ID and items are required",
      });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const order = await Order.create({
      orderId,
      user: userId,
      items,
      address,
      instruction,
      total: totalAmount,
      paymentMethod: paymentInfo?.method || "COD",
      timeline: [
        { status: "PLACED", note: "Order placed successfully" },
      ],
    });

    return res.json({ success: true, order });
  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to place order",
      error: err.message,
    });
  }
};

/* =====================================================
   GET ORDERS (ADMIN + USER)
===================================================== */
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const p = parseInt(page);
    const l = parseInt(limit);

    let query = {};
    if (userId) query.user = userId;

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l);

    return res.json({
      success: true,
      orders,
      total,
      page: p,
      limit: l,
    });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to load orders",
      error: err.message,
    });
  }
};
