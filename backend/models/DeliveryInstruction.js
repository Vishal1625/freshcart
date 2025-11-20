import mongoose from "mongoose";

const DeliveryInstructionSchema = new mongoose.Schema(
  {
    userId: String,
    instruction: String
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryInstruction", DeliveryInstructionSchema);
