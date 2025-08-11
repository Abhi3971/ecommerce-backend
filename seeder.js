const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/product");
const products = require("./products"); // Your seeder data

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // Clears existing products
    const createdProducts = await Product.insertMany(products);
    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
