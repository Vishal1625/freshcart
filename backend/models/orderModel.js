import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productImage: { type: String },
    orderId: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Cancelled"],
      default: "Processing",
    },
    amount: { type: Number, required: true },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
