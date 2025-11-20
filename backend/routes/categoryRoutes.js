import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

/* ==============================
   GET ALL CATEGORIES
============================== */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error loading categories" });
  }
});

/* ==============================
   ADD NEW CATEGORY
============================== */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name required" });
    }

    // Check duplicates
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.json(category);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==============================
   UPDATE CATEGORY
============================== */
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    res.json(category);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==============================
   DELETE CATEGORY
============================== */
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
