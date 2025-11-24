// backend/routes/offerRoutes.js
import express from "express";
import Offer from "../models/Offer.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ADMIN: create offer
router.post("/", auth, isAdmin, async (req, res) => {
    const offer = new Offer(req.body);
    await offer.save();
    res.json({ success: true, offer });
});

// ADMIN: list offers
router.get("/", auth, isAdmin, async (req, res) => {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ offers });
});

// validate from frontend
router.post("/validate", async (req, res) => {
    const { code, subtotal } = req.body;

    const offer = await Offer.findOne({ code, active: true });
    if (!offer) return res.json({ valid: false });

    const now = new Date();
    if (offer.startDate && offer.startDate > now)
        return res.json({ valid: false });
    if (offer.endDate && offer.endDate < now)
        return res.json({ valid: false });

    if (subtotal < (offer.minCartAmount || 0))
        return res.json({ valid: false, reason: "MIN_AMOUNT" });

    res.json({ valid: true, offer });
});

export default router;
