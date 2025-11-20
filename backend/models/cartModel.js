

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            qty: Number,
            image: String,
        }
    ],
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
