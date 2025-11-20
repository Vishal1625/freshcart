import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["Home", "Office"], default: "Home" },
    name: String,
     userId: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipcode: String,
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);
