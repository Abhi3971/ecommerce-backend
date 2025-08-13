const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// --------- Middlewares ---------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- CORS Configuration (Allow All) ---------
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // set to true only if using cookies/auth headers
  })
);

// --------- Routes ---------
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce Website API");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// --------- Error Handling ---------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// --------- Start Server ---------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
