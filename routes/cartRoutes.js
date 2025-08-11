const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");

const router = express.Router();

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// Add / Increase quantity
router.post("/", async (req, res) => {
    const { productId, quantity, size, guestId, userId } = req.body;
    try {
        const productData = await Product.findById(productId);
        if (!productData) return res.status(404).json({ message: "Product not found" });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId && p.size === size
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    name: productData.name,
                    image: productData.image.url,
                    price: productData.price,
                    size,
                    quantity,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId || "guest_" + Date.now(),
                products: [
                    {
                        productId,
                        name: productData.name,
                        image: productData.image.url,
                        price: productData.price,
                        size,
                        quantity,
                    },
                ],
                totalPrice: productData.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get cart
router.get("/", async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        res.json(cart || { products: [], totalPrice: 0 });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Decrease quantity
router.put("/decrease", async (req, res) => {
    const { productId, size, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const index = cart.products.findIndex(p => p.productId.toString() === productId && p.size === size);
        if (index > -1) {
            cart.products[index].quantity -= 1;
            if (cart.products[index].quantity <= 0) {
                cart.products.splice(index, 1);
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Remove product
router.post("/remove", async (req, res) => {
    const { productId, size, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(p => !(p.productId.toString() === productId && p.size === size));
        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
