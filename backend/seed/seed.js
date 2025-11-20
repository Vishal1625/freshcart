import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const categories = [
  {
    title: "Snacks & Munchies",
    items: ["Chips", "Namkeen", "Popcorn"]
  },
  {
    title: "Fruits & Vegetables",
    items: ["Fresh Fruits", "Organic Fruits"]
  }
];

const products = [
  {
    name: "Haldiram's Sev Bhujia",
    category: null, // Will populate after categories inserted
    store: "E-Grocery",
    price: 18,
    oldPrice: 24,
    rating: 4.5,
    reviews: 149,
    image: "product-img-1.jpg",
    badge: "Sale"
  },
  {
    name: "NutriChoice Digestive",
    category: null,
    store: "BigBasket",
    price: 24,
    oldPrice: null,
    rating: 4.5,
    reviews: 25,
    image: "product-img-2.jpg",
  }
];

const seedDB = async () => {
  await Category.deleteMany();
  const insertedCategories = await Category.insertMany(categories);

  // map products to category ids
  products[0].category = insertedCategories[0]._id;
  products[1].category = insertedCategories[0]._id;

  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Seeded DB");
  mongoose.disconnect();
};

seedDB();

import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

export const runSeed = async () => {
  const customersCount = await Customer.countDocuments();
  const ordersCount = await Order.countDocuments();

  if (customersCount > 0 && ordersCount > 0) {
    console.log("✅ Seed already exists, skipping...");
    return;
  }

  console.log("🌱 Seeding sample data...");

  // ✅ Sample Customers
  const seedCustomers = await Customer.insertMany([
    { name: "Vishal Kumar", email: "vishal@example.com", phone: "9876543210" },
    { name: "Riya Sharma", email: "riya@gmail.com", phone: "9922334477" },
    { name: "Aman Verma", email: "aman@gmail.com", phone: "9988776655" },
    { name: "Priya Singh", email: "priya@gmail.com", phone: "7788996655" },
    { name: "Rahul Yadav", email: "rahul@mail.com", phone: "8877665544" }
  ]);

  const c1 = seedCustomers[0];
  const c2 = seedCustomers[1];
  const c3 = seedCustomers[2];
  const c4 = seedCustomers[3];
  const c5 = seedCustomers[4];

  // ✅ Sample Orders
  await Order.insertMany([
    {
      customer: c1._id,
      items: [
        { name: "Dog Food", qty: 2, price: 499 },
        { name: "Cat Toy", qty: 1, price: 199 }
      ],
      total: 1197,
      paymentMethod: "UPI",
      status: "Delivered"
    },
    {
      customer: c2._id,
      items: [
        { name: "Dog Collar", qty: 1, price: 299 }
      ],
      total: 299,
      paymentMethod: "COD",
      status: "Pending"
    },
    {
      customer: c3._id,
      items: [
        { name: "Fish Food", qty: 3, price: 150 }
      ],
      total: 450,
      paymentMethod: "UPI",
      status: "Delivered"
    },
    {
      customer: c4._id,
      items: [
        { name: "Pet Shampoo", qty: 1, price: 350 }
      ],
      total: 350,
      paymentMethod: "UPI",
      status: "Shipped"
    },
    {
      customer: c5._id,
      items: [
        { name: "Dog Leash", qty: 1, price: 250 },
        { name: "Dog Treats", qty: 2, price: 199 }
      ],
      total: 648,
      paymentMethod: "UPI",
      status: "Delivered"
    },
    {
      customer: c1._id,
      items: [
        { name: "Cat Bed", qty: 1, price: 899 }
      ],
      total: 899,
      paymentMethod: "COD",
      status: "Pending"
    },
    {
      customer: c3._id,
      items: [
        { name: "Bird Seeds", qty: 5, price: 90 }
      ],
      total: 450,
      paymentMethod: "UPI",
      status: "Delivered"
    },
    {
      customer: c4._id,
      items: [
        { name: "Pet Bowl", qty: 2, price: 150 }
      ],
      total: 300,
      paymentMethod: "UPI",
      status: "Pending"
    }
  ]);

  console.log("✅ Seed completed!");
};
runSeed();