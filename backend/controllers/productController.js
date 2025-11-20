

import Product from "../models/Product.js";

/* ============================================================================
   CREATE PRODUCT (Admin)
============================================================================ */
export const createProduct = async (req, res) => {
  try {
    const images =
      req.files?.map((file) => `/uploads/products/${file.filename}`) || [];

    const product = await Product.create({
      ...req.body,
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.log("Create Error:", err);
    res.status(500).json({ success: false, error: "Failed to create product" });
  }
};

/* ============================================================================
   GET PRODUCTS (Frontend + Admin) — Search + Pagination + Category
============================================================================ */
export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const skipCount = (page - 1) * limit;

    const products = await Product.find(filter)
      .skip(skipCount)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({ success: true, products, total });
  } catch (err) {
    console.log("Get Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

/* ============================================================================
   GET SINGLE PRODUCT
============================================================================ */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid product ID" });
  }
};

/* ============================================================================
   UPDATE PRODUCT (Admin)
============================================================================ */
export const updateProduct = async (req, res) => {
  try {
    const newImages =
      req.files?.map((file) => `/uploads/products/${file.filename}`) || [];

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Preserve old images if no new images uploaded
    const updatedData = {
      ...req.body,
      images: newImages.length > 0 ? newImages : existingProduct.images,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({ success: true, product });
  } catch (err) {
    console.log("Update Error:", err);
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
};

/* ============================================================================
   DELETE PRODUCT
============================================================================ */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};

/* ============================================================================
   SIMPLE LIST PRODUCTS
============================================================================ */
export const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, category } = req.query;

    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================================
   FILTER + SORT PRODUCTS
============================================================================ */
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 12 } =
      req.query;

    const filter = {};

    if (category) filter.category = category;

    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    const skip = (page - 1) * limit;

    let sortOption = {};
    if (sort === "low-to-high") sortOption.price = 1;
    if (sort === "high-to-low") sortOption.price = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOption);

    const total = await Product.countDocuments(filter);

    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================================
   SEARCH PRODUCTS
============================================================================ */
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================================
   CATEGORY PRODUCTS
============================================================================ */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
