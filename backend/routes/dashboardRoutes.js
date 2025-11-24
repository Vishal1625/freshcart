

import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// Helper: date range for "today"
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * GET /api/dashboard/overview
 * Stats for cards
 */
router.get("/overview", async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    // Parallel queries for performance
    const [
      productsCount,
      orders,
      todayOrdersList,
      distinctCustomers,
      lowStockCount,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
    ] = await Promise.all([
      Product.countDocuments(), // total products
      Order.find(), // all orders
      Order.find({ createdAt: { $gte: start, $lte: end } }),
      Order.distinct("userId"),
      Product.countDocuments({ stock: { $lte: 5 } }), // "5" threshold for low stock
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayOrders = todayOrdersList.length;
    const todayRevenue = todayOrdersList.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    res.json({
      products: productsCount,
      orders: orders.length,
      totalSales,
      todayOrders,
      todayRevenue,
      customers: distinctCustomers.length,
      lowStock: lowStockCount,
      pendingOrders: pendingCount,
      processingOrders: processingCount,
      shippedOrders: shippedCount,
      deliveredOrders: deliveredCount,
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ error: "Dashboard overview error" });
  }
});

/**
 * GET /api/dashboard/sales-graph
 * Returns last 7 days sales grouped by day
 * Format expected by ChartCard: [{ date: '2025-01-01', sales: 1234 }]
 */
router.get("/sales-graph", async (req, res) => {
  try {
    const days = 7; // last 7 days
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);

      const row = data.find((x) => x._id === key);
      result.push({
        date: key,
        sales: row ? row.sales : 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Sales graph error:", err);
    res.status(500).json({ error: "Dashboard graph error" });
  }
});

/**
 * GET /api/dashboard/recent-orders
 * Returns last 10 orders for table
 */
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderId customerName total status createdAt");

    res.json({ orders });
  } catch (err) {
    console.error("Recent orders error:", err);
    res.status(500).json({ error: "Recent orders error" });
  }
});

export default router;
