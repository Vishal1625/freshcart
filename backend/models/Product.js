
// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, trim: true, index: true, unique: true },

    description: { type: String, default: "" },

    category: { type: String, required: true, trim: true, index: true },

    price: { type: Number, required: true, default: 0 },
    mrp: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", default: null }, // optional
    sku: { type: String, default: "", trim: true },

    images: [{ type: String }], // e.g. /uploads/products/xyz.jpg

    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },

    attributes: { type: mongoose.Schema.Types.Mixed }, // e.g. weight, size, brand

    createdBy: { type: String }, // admin email or ID
  },
  { timestamps: true }
);

/* ============================================================
   FUNCTION TO GENERATE CLEAN SLUG
============================================================ */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ============================================================
   AUTO GENERATE SLUG ON CREATE + UPDATE
============================================================ */
productSchema.pre("save", async function (next) {
  // If name changed OR slug missing
  if (this.isModified("name") || !this.slug) {
    let baseSlug = generateSlug(this.name);
    let finalSlug = baseSlug;

    // Ensure slug is unique
    const existing = await mongoose.models.Product.findOne({
      slug: finalSlug,
      _id: { $ne: this._id },
    });

    if (existing) {
      finalSlug = baseSlug + "-" + Math.floor(1000 + Math.random() * 9000);
    }

    this.slug = finalSlug;
  }

  // Auto-generate SKU if missing
  if (!this.sku || this.sku.trim() === "") {
    this.sku = "SKU-" + Math.floor(100000 + Math.random() * 900000);
  }

  next();
});

/* ============================================================
   SAFE EXPORT MODEL
============================================================ */
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;


