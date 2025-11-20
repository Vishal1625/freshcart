import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* ---------------------------------------------------
   🟢 Add to Cart
------------------------------------------------------ */
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, qty = 1 } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ error: "userId & productId required" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const exists = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (exists) {
      exists.quantity += qty;
    } else {
      cart.items.push({
        productId,
        quantity: qty,
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

/* ---------------------------------------------------
   🟢 Get Cart
------------------------------------------------------ */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

/* ---------------------------------------------------
   🔄 Update Cart Item Quantity
------------------------------------------------------ */
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    if (!userId || !productId || qty == null)
      return res.status(400).json({ error: "userId, productId & qty required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId.toString()
      );
    } else {
      item.quantity = qty;
    }

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------------------------------------------
   🗑️ Remove Cart Item
------------------------------------------------------ */
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ error: "userId & productId required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------------------------------------------
   🟢 Clear Entire Cart
------------------------------------------------------ */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.findOneAndDelete({ userId });

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};
