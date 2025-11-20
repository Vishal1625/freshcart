// seed/seedProducts.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
dotenv.config();

const data = [
    { name: "Haldiram's Sev Bhujia", price: 18, mrp: 24, image: "/uploads/products/product1.jpg", category: "Snack & Munchies", stock: 100, rating: 4.5 },
    { name: "NutriChoice Digestive", price: 24, mrp: 30, image: "/uploads/products/product2.jpg", category: "Bakery & Biscuits", stock: 120, rating: 4.5 },
    { name: "Cadbury 5 Star Chocolate", price: 32, mrp: 35, image: "/uploads/products/product3.jpg", category: "Bakery & Biscuits", stock: 200, rating: 5 },
    { name: "Onion Flavour Potato", price: 3, mrp: 5, image: "/uploads/products/product4.jpg", category: "Snack & Munchies", stock: 300, rating: 3.5 },
    { name: "Salted Instant Popcorn", price: 13, mrp: 18, image: "/uploads/products/product5.jpg", category: "Instant Food", stock: 150, rating: 4.5 },
    { name: "Blueberry Greek Yogurt", price: 18, mrp: 24, image: "/uploads/products/product6.jpg", category: "Dairy, Bread & Eggs", stock: 80, rating: 4.5 },
    { name: "Britannia Cheese Slices", price: 24, mrp: 30, image: "/uploads/products/product7.jpg", category: "Dairy, Bread & Eggs", stock: 90, rating: 5 },
    { name: "Kellogg's Original Cereals", price: 32, mrp: 35, image: "/uploads/products/product8.jpg", category: "Instant Food", stock: 110, rating: 4 },
    { name: "Slurrp Millet Chocolate", price: 3, mrp: 5, image: "/uploads/products/product9.jpg", category: "Snack & Munchies", stock: 220, rating: 4.5 },
    { name: "Amul Butter - 500 g", price: 13, mrp: 18, image: "/uploads/products/product10.jpg", category: "Dairy, Bread & Eggs", stock: 140, rating: 3.5 }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(data);
        console.log("✅ Seeded products");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
