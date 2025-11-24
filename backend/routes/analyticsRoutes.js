import express from "express";
import { getMonthlyStats } from "../controllers/analyticsController.js";

const router = express.Router();
router.get("/monthly", getMonthlyStats);
router.get("/top-cities", authDelivery, getTopCities);
router.get("/heatmap", authDelivery, getHeatmapData);
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

// backend/routes/analyticsRoutes.js
import Order from "../models/Order.js";
import { auth, isAdmin } from "../middleware/auth.js";

// HEATMAP: lat/lng + order count
router.get("/heatmap", auth, isAdmin, async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                $match: {
                    "address.lat": { $ne: null },
                    "address.lng": { $ne: null },
                },
            },
            {
                $group: {
                    _id: { lat: "$address.lat", lng: "$address.lng" },
                    count: { $sum: 1 },
                },
            },
        ]);

        const formatted = data.map((d) => ({
            lat: d._id.lat,
            lng: d._id.lng,
            count: d.count,
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: "Heatmap error" });
    }
});

// TOP CITIES
router.get("/top-cities", auth, isAdmin, async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                $group: {
                    _id: "$address.city",
                    count: { $sum: 1 },
                    totalSales: { $sum: "$total" },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        res.json(
            data.map((d) => ({
                city: d._id || "Unknown",
                orders: d.count,
                totalSales: d.totalSales,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: "Top cities error" });
    }
});

export default router;
