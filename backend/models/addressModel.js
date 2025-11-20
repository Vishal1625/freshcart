import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
     userId: { type: String, required: true },
    type: { type: String, enum: ["Home", "Office"], default: "Home" },
    email: { type: String,
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;

