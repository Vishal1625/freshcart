import mongoose from "mongoose";

const DeliverySlotSchema = new mongoose.Schema(
  {
    userId: String,
    date: String,  // "Oct 3"
    slot: String,  // "Within 2 Hours" / "1pm - 2pm"
    price: Number  // delivery fee
  },
  { timestamps: true }
);

export default mongoose.model("DeliverySlot", DeliverySlotSchema);
