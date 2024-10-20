import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [crops, setCrops] = useState({});
  const currUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        if (currUser && currUser.currentUser && currUser.currentUser._id) {
          const res = await axios.get(`/api/order/getorders/${currUser.currentUser._id}`);
          if (res.status === 200) {
            const reversedOrders=res.data.orders.reverse();
            setOrderHistory(reversedOrders); 
            const cropIds = [...new Set(reversedOrders.flatMap(order => order.items.map(item => item.cropId)))];

                    // Fetch crops in parallel with corrected URL
                    const cropPromises = cropIds.map(cropId => axios.get(`/api/crop/getSpecificCrops/${cropId}`)); 
                    const cropResponses = await Promise.all(cropPromises);
                    const cropMap = {};
                    cropResponses.forEach(response => {
                        if (response.status === 200) {
                            cropMap[response.data[0]._id] = response.data[0].name; 
                        }
                    });
                  
                  setCrops(cropMap);
          }
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, [currUser]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Order History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white  dark:bg-slate-800 border border-green-400 rounded-lg shadow-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-green-600">Order ID</th>
              <th className="py-2 px-4 border-b text-left text-green-600">Date</th>
              <th className="py-2 px-4 border-b text-left text-green-600">Status</th>
              <th className="py-2 px-4 border-b text-left text-green-600">Items</th>
              <th className="py-2 px-4 border-b text-left text-green-600">Total Price</th>
              <th className="py-2 px-4 border-b text-left text-green-600">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.length > 0 ? (
              orderHistory.map((order) => (
                <tr key={order._id} className="hover:bg-green-50 dark:hover:bg-slate-500">
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index} className="border-b border-green-300 py-1">
                          <p>Crop Name: {crops[item.cropId] || 'Loading...'}</p>
                          <p>Farmer ID: {item.farmerId}</p>
                          <p>Quantity: {item.qty}</p>
                          <p>Price per kg: ₹{item.pricePerKg}</p>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b">₹{order.totalPrice}</td>
                  <td className="py-2 px-4 border-b">{order.paymentId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
