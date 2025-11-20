import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cardType: { type: String, enum: ["Visa", "Mastercard", "American Express", "Discover", "PayPal"], required: true },
    cardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    cvv: { type: String, required: true },
    method: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
