import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentLocation: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
    },
}, { timestamps: true });

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

export default DeliveryBoy;
