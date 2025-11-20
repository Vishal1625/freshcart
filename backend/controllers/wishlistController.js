import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// POST /api/wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: "userId & productId required" });

    // upsert unique via schema index -> catch duplicate error
    const exist = await Wishlist.findOne({ userId, productId });
    if (exist) return res.json({ success: true, message: "Already in wishlist" });

    const w = new Wishlist({ userId, productId });
    await w.save();
    res.json({ success: true, wishlist: w });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/wishlist/:userId
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Wishlist.find({ userId }).populate("productId");
    res.json({ success: true, items: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/wishlist/remove/:userId/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Wishlist.findOneAndDelete({ userId, productId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
