// backend/models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true }, // e.g. FRESH50
        description: String,
        type: { type: String, enum: ["PERCENT", "FLAT"], required: true },
        value: { type: Number, required: true }, // 10 = 10% or ₹10
        minCartAmount: { type: Number, default: 0 },
        maxDiscount: { type: Number, default: 0 }, // 0 = no cap
        startDate: Date,
        endDate: Date,
        active: { type: Boolean, default: true },
        applicableCategories: [String],      // optional
        applicableProductIds: [String],      // optional
    },
    { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
