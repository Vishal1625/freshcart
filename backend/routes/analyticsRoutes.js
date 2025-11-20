import express from "express";
import { getMonthlyStats } from "../controllers/analyticsController.js";

const router = express.Router();
router.get("/monthly", getMonthlyStats);

import Order from "../models/Order.js";


/* --------------------------------------------------
   DAILY REVENUE ANALYTICS
   Example Output:
   [
     { name: "2025-11-10", total: 899 },
     { name: "2025-11-14", total: 499 }
   ]
-------------------------------------------------- */
router.get("/revenue-daily", async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { "_id": 1 } } // Sort by date
        ]);

        const formatted = revenue.map(r => ({
            name: r._id,
            total: r.total
        }));

        res.json(formatted);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching analytics" });
    }
});

export default router;
