import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, cart, totalPrice, paymentId } = req.body;

    if (!userId || !cart || !totalPrice || !paymentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      user: userId,
      items: cart.map(item => ({
        farmerId: item.userId,
        cropId:item._id,
        qty: item.qty,
        pricePerKg: item.pricePerKg
      })),
      totalPrice,
      paymentId,
      status: 'placed'
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const fetchFarmerOrders = async(req,res) => {
  try{
    const allOrderData = await Order.find({})
    if (!allOrderData || allOrderData.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({ success: true, allOrderData });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Update the status
      order.status = status;
      await order.save();

      return res.status(200).json({ message: 'Order status updated successfully', status: order.status });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};
