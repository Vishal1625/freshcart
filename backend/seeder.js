const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/wishlistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  { name: "Organic Banana", price: 35, unit: "$.98 / lb", image: "productimage18.jpg", stock: true },
  { name: "Fresh Kiwi", price: 20.97, unit: "4 no", image: "productimage17.jpg", stock: false },
  { name: "Golden Pineapple", price: 35, unit: "2 no", image: "productimage16.jpg", stock: true },
  { name: "BeatRoot", price: 29, unit: "1 kg", image: "productimage19.jpg", stock: true },
  { name: "Fresh Apple", price: 70, unit: "2 kg", image: "productimage15.jpg", stock: true },
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Products Seeded");
  mongoose.connection.close();
};

seedDB();
