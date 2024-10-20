import mongoose from "mongoose";
import Crop from "./crop.model";

// Define the schema for the cart item
const cartItemSchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop', // Reference to the Crop model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Create the CartItem model
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
