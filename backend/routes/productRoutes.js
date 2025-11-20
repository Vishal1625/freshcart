import express from "express";
import {

  getProductById,
  searchProducts,
  getProductsByCategory,
  getFilteredProducts,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController.js";

import uploadMultiple from "../middleware/uploadMultiple.js";

const router = express.Router();

/* ============================================================
   ADMIN ROUTES (Image Upload + CRUD)
============================================================ */

// CREATE product with images
router.post(
  "/admin",
  uploadMultiple.array("images", 6),
  createProduct
);

// UPDATE product with images
router.put(
  "/admin/:id",
  uploadMultiple.array("images", 6),
  updateProduct
);

// DELETE product
router.delete("/admin/:id", deleteProduct);

/* ============================================================
   SEARCH
============================================================ */
router.get("/search", searchProducts);

/* ============================================================
   CATEGORY
============================================================ */
router.get("/category/:category", getProductsByCategory);

/* ============================================================
   FILTER + SORT
============================================================ */
router.get("/filter", getFilteredProducts);

/* ============================================================
   SIMPLE LIST (Light Pagination)
============================================================ */
router.get("/list", listProducts);

/* ============================================================
   MAIN LIST (Frontend + Admin Table)
============================================================ */
router.get("/", getProducts);

/* ============================================================
   SINGLE PRODUCT (Keep at the bottom)
============================================================ */
router.get("/:id", getProductById);

export default router;
