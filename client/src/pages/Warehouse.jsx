import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Badge, Card, Select } from 'flowbite-react';
import { GiPlantWatering } from 'react-icons/gi';

export default function Warehouse() {
  const farmer = useSelector((state) => state.user.currentUser._id);
  const [allOrder, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const possibleStatuses = ['Pending', 'Shipped', 'Delivered']; // Define possible status values

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`/api/order/getAllOrders`);
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await res.json();
        setAllOrders(data.allOrderData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/updateOrderStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updatedOrder = await res.json();

      // Update the state with the new status
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      {allOrder ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {allOrder.map((order) => (
            <div key={order._id} style={{ display: 'flex' }}>
              {order.items
                .filter((item) => item.farmerId === farmer)
                .map((item, index) => (
                  <Card
                    key={item._id}
                    className="flex flex-col gap-4 w-full max-w-xs dark:bg-slate-800 rounded-md shadow-md m-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-500">
                          <strong>Order Id: </strong>
                          {order._id}
                        </p>
                        <p className="text-xl font-semibold">{item.qty} Kg</p>
                      </div>
                      <GiPlantWatering className="text-teal-600 text-3xl" />
                    </div>
                    <p className="text-gray-500">
                      <strong>Price per Kg: ₹</strong>
                      {item.pricePerKg}
                    </p>
                    <p className="text-gray-500">
                      <strong>Distributor Id: </strong>
                      {order.user}
                    </p>
                    <p className="text-gray-500">
                      <strong>Status: </strong>
                      {/* Dropdown menu for status change */}
                      <Select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {possibleStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </p>
                    <p className="text-gray-500">
                      <strong>Order Date: </strong>
                      {order.createdAt}
                    </p>
                    <p className="text-gray-500">
                      <strong>Total Price: </strong> ₹
                      {item.pricePerKg * item.qty}
                    </p>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
}
