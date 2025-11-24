import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";
import { auth } from "../middleware/auth.js";

import {
   saveAddress,
   getAddresses,
   deleteAddress,
   saveInstruction,
   saveDeliverySlot,
   savePaymentMethod,
} from "../controllers/checkoutController.js";

import { generateOrderId } from "../utils/generateOrderId.js";

import { sendWhatsAppText } from "../utils/whatsapp.js";

const router = express.Router();

/* ----------------------------------------------------
 🏠 ADDRESS ROUTES
-------------------------------------------------------*/
router.post("/address/save", saveAddress);
router.get("/address/:userId", getAddresses);
router.post("/address/delete", deleteAddress);

/* ----------------------------------------------------
 💬 INSTRUCTION
-------------------------------------------------------*/
router.post("/instruction/save", saveInstruction);

/* ----------------------------------------------------
 ⏰ DELIVERY SLOT
-------------------------------------------------------*/
router.post("/delivery-slot/save", saveDeliverySlot);

/* ----------------------------------------------------
 💳 PAYMENT METHOD
-------------------------------------------------------*/
router.post("/payment/save", savePaymentMethod);

/* ----------------------------------------------------
 🎟 APPLY OFFER (internal function)
-------------------------------------------------------*/
async function applyOfferIfAny(items, offerCode, subtotal) {
   if (!offerCode) return { discount: 0, appliedOfferCode: null };

   const offer = await Offer.findOne({ code: offerCode, active: true });
   if (!offer) return { discount: 0 };

   const now = new Date();
   if (offer.startDate && offer.startDate > now) return { discount: 0 };
   if (offer.endDate && offer.endDate < now) return { discount: 0 };

   if (subtotal < (offer.minCartAmount || 0)) return { discount: 0 };

   let discount = offer.type === "PERCENT"
      ? (subtotal * offer.value) / 100
      : offer.value;

   if (offer.maxDiscount && discount > offer.maxDiscount) {
      discount = offer.maxDiscount;
   }

   return { discount, appliedOfferCode: offer.code };
}

/* ----------------------------------------------------
 🛒 PLACE ORDER  (FINAL MERGED VERSION)
-------------------------------------------------------*/
router.post("/place-order", auth, async (req, res) => {
   try {
      const {
         items,
         address,
         instruction,
         paymentInfo,
         offerCode,
      } = req.body;

      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
      const shipping = subtotal > 499 ? 0 : 30;

      const { discount, appliedOfferCode } = await applyOfferIfAny(items, offerCode, subtotal);
      const total = subtotal + shipping - discount;

      // Stock update
      for (const item of items) {
         const updated = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty } },
            { new: true }
         );

         if (!updated) {
            return res.json({
               success: false,
               error: `Out of stock: ${item.name}`,
            });
         }
      }

      const order = new Order({
         orderId: generateOrderId(),
         userId: req.user._id,
         customerName: req.user.name,
         mobile: req.user.phone,
         items,
         address,
         instruction,
         paymentInfo: {
            method: paymentInfo.method,
            status: paymentInfo.status || "Pending",
         },
         subtotal,
         shipping,
         discount,
         total,
         appliedOfferCode,
         status: "Pending",
         timeline: [{ status: "Pending", note: "Order placed" }],
      });

      await order.save();

      // SEND EMAIL
      const mailHtml = `
      <h2>Order Confirmed</h2>
      <p>Order ID: ${order.orderId}</p>
      <p>Total: ₹${order.total}</p>
    `;
      await sendEmail(req.user.email, "Your Order", mailHtml);
      await sendEmail(process.env.ADMIN_EMAIL || req.user.email, "New Order Received", mailHtml);

      // WHATSAPP MESSAGE
      await sendWhatsAppText(
         process.env.ADMIN_WHATSAPP || "91XXXXXXXXXX",
         `New order: ${order.orderId}, Total: ₹${order.total}`
      );

      return res.json({ success: true, orderId: order.orderId, _id: order._id });

   } catch (err) {
      console.log(err);
      res.json({ success: false, error: err.message });
   }
});

/* ----------------------------------------------------
 📦 ORDER CRUD (Admin)
-------------------------------------------------------*/
router.get("/orders", async (req, res) => {
   const orders = await Order.find().sort({ createdAt: -1 });
   res.json({ orders });
});

router.get("/orders/:id", async (req, res) => {
   const order = await Order.findById(req.params.id);
   res.json({ order });
});

router.put("/orders/:id/status", async (req, res) => {
   const { status, deliveredDate } = req.body;

   const update = { status };
   if (deliveredDate) update.deliveredDate = deliveredDate;

   await Order.findByIdAndUpdate(req.params.id, update);
   res.json({ success: true });
});

/* ----------------------------------------------------
 🔄 RE-ORDER
-------------------------------------------------------*/
router.post("/orders/reorder", async (req, res) => {
   const { orderId } = req.body;

   const order = await Order.findOne({ orderId });
   if (!order) return res.json({ success: false });

   res.json({ success: true, items: order.items });
});

export default router;
