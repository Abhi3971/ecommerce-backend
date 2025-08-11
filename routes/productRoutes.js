const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

// @desc   Get all products
// @route  GET /api/products
// @access Public
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc   Get single product by ID
// @route  GET /api/products/:id
// @access Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc   Create product
// @route  POST /api/products
// @access Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, description, price, category, brand, sizes, image, gender } = req.body;

        // Validation
        if (!name || !description || !price || !category || !sizes || !image || !gender) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            brand,
            sizes,
            image,
            gender,                      // <------ added here
            user: req.user._id,
        });

        const createdProduct = await newProduct.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @desc   Update product
// @route  PUT /api/products/:id
// @access Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const { name, description, price, category, brand, sizes, image, gender } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.image = image || product.image;
        product.gender = gender || product.gender;         // <------ added here

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
