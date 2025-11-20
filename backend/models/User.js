import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ============================
   PASSWORD RESET SCHEMA
============================ */
const passwordResetSchema = new mongoose.Schema({
  tokenHash: String,
  expiresAt: Date,
});

/* ============================
   MAIN USER SCHEMA
============================ */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },

    // Login fields
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    // Role management
    role: {
      type: String,
      default: "user",
      enum: ["admin", "manager", "editor", "user"]
    },

    refreshToken: { type: String },

    passwordReset: passwordResetSchema,
  },
  { timestamps: true }
);

/* ============================
   PASSWORD HASHING
============================ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ============================
   COMPARE PASSWORD METHOD
============================ */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ============================
   EXPORT MODEL
============================ */
export default mongoose.models.User ||
  mongoose.model("User", userSchema);
