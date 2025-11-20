import express from "express";
import {
   saveAddress,
   savePaymentMethod,
   getAddresses,
   deleteAddress,
   saveInstruction,
   saveDeliverySlot,
   placeOrder,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/place-order", placeOrder);

/* ------------------------------------------
   🏠 ADDRESS ROUTES
------------------------------------------- */
router.post("/address/save", saveAddress);
router.get("/address/:userId", getAddresses);
router.post("/address/delete", deleteAddress);

/* ------------------------------------------
   💬 ORDER INSTRUCTION
------------------------------------------- */
router.post("/instruction/save", saveInstruction);
import { updateOrderStatus } from "../controllers/checkoutController.js";

router.put("/orders/:id/status", updateOrderStatus);

/* ------------------------------------------
   ⏰ DELIVERY SLOT
------------------------------------------- */
router.post("/delivery-slot/save", saveDeliverySlot);

/* ------------------------------------------
   💳 PAYMENT METHOD
------------------------------------------- */
router.post("/payment/save", savePaymentMethod);

/* ------------------------------------------
   🛒 PLACE ORDER
------------------------------------------- */
router.post("/place-order", async (req, res) => {
   console.log("Incoming Order:", req.body);   // Debug log

   return placeOrder(req, res); // Forward request to controller
});

export default router;
