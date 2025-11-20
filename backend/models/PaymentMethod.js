import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
  {
    userId: String,
    method: { type: String, enum: ["PAYPAL", "CARD", "PAYONEER", "COD"] }
  },
  { timestamps: true }
);

export default mongoose.model("PaymentMethod", PaymentMethodSchema);
