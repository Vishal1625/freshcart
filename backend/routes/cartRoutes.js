import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.delete("/clear/:userId", clearCart);



import Cart from "../models/cartModel.js";



/* ===========================================
   1️⃣ ADD TO CART
=========================================== */
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, name, price, image } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const item = cart.items.find(i => i.productId === productId);

        if (item) {
            item.qty += 1; // increase qty if exists
        } else {
            cart.items.push({ productId, name, price, image, qty: 1 });
        }

        await cart.save();
        res.json({ success: true, cart });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Add to cart failed" });
    }
});

/* ===========================================
   2️⃣ GET CART
=========================================== */
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json(cart);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

/* ===========================================
   3️⃣ REMOVE ITEM
=========================================== */
router.delete("/remove/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) return res.json({ items: [] });

        cart.items = cart.items.filter(item => item.productId !== productId);

        await cart.save();
        res.json({ success: true, items: cart.items });

    } catch (err) {
        res.status(500).json({ error: "Failed to remove item" });
    }
});

/* ===========================================
   4️⃣ CLEAR CART
=========================================== */
router.delete("/clear/:userId", async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
});

/* ===========================================
   5️⃣ UPDATE QUANTITY (OPTIONAL)
=========================================== */
router.put("/update/:userId/:productId", async (req, res) => {
    try {
        const { qty } = req.body;

        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) return res.json({ items: [] });

        const item = cart.items.find(i => i.productId === req.params.productId);

        if (item) {
            item.qty = qty;
        }

        await cart.save();
        res.json({ success: true, items: cart.items });

    } catch (err) {
        res.status(500).json({ error: "Failed to update quantity" });
    }
});


export default router;
