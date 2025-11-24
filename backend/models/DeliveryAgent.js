// backend/models/DeliveryAgent.js
import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: String,
        phone: String,
        isActive: { type: Boolean, default: true },
        currentLocation: {
            lat: Number,
            lng: Number,
            updatedAt: Date,
        },
        assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    },
    { timestamps: true }
);

export default mongoose.model("DeliveryAgent", deliveryAgentSchema);
