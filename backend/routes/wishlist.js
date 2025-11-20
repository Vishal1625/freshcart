
import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";


const router = express.Router();

// GET all wishlist items for a user
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.params.userId }).populate("product");
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD product to wishlist
router.post("/", async (req, res) => {
  try {
    const { productId, userId } = req.body;

    const exists = await Wishlist.findOne({ product: productId, user: userId });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const newItem = new Wishlist({ product: productId, user: userId });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REMOVE product from wishlist
router.delete("/:wishlistId", async (req, res) => {
  try {
    const deleted = await Wishlist.findByIdAndDelete(req.params.wishlistId);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
