import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      farmerId: { type: String, required: true },
      cropId: {type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
      qty: { type: Number, required: true },
      pricePerKg: { type: Number, required: true }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Order = mongoose.model('Order', orderSchema);
export default Order;
