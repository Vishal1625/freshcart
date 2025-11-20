import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================
   1. DASHBOARD OVERVIEW DATA
=============================== */
router.get("/overview", async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    const salesAgg = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);

    const totalSales = salesAgg.length > 0 ? salesAgg[0].totalSales : 0;

    res.json({
      products,
      orders,
      totalSales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================
   2. SALES CHART DATA
=============================== */
router.get("/sales-graph", async (req, res) => {
  try {
    // Group sales per day like your sampleData
    const chart = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          sales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formatted = chart.map(item => ({
      name: item._id,
      sales: item.sales
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
