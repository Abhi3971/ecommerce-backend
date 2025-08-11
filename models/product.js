const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Top Wear", "Bottom Wear"], 
    },
    brand: {
      type: String,
    },
    sizes: {
      type: [String],
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Men", "Women"],
    },
    inStock: {
      type: Boolean,
      default: true, 
    },
    fastDelivery: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
