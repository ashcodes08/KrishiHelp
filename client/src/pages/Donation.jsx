import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

function Donation() {
  const navigate = useNavigate();
  const [paisa, setPaisa] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePayment = async () => {
    try {
      // Send request to your backend to create a Razorpay order
      const { data } = await axios.post('http://localhost:3000/createOrder', {
        amount: paisa,
        phoneNumber: phoneNumber, // send the phone number along with the amount
        name: 'Cart Purchase',
        description: 'Payment for items in your cart',
      });

      // If order created successfully, proceed with Razorpay checkout
      if (data.success) {
        console.log("Order created successfully");
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: "INR",
          name: data.product_name,
          description: data.description,
          image: ShoppingCartTwoToneIcon, // Optional image
          order_id: data.order_id, // Order ID returned from your backend
          handler: function (response) {
            alert("Payment Successful");

            // Send payment success details to the backend to update the database
            const donationData = {
              phoneNumber, 
              amount: paisa, 
              payment_id: response.razorpay_payment_id,
            };
            // Save payment details to the database
            const res = fetch('/api/donation/donated', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(donationData),
            });
            
            
      

            setPaisa(0); // Reset donation amount
            setPhoneNumber(""); // Reset phone number
          },
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.contact,
          },
          theme: {
            color: "#2300a3",
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        razorpay.on('payment.failed', function (response) {
          alert("Payment Failed: " + response.error.description);
        });
      } else {
        alert('Order creation failed');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 bg-gray-200 dark:bg-slate-700">
      <div className="flex flex-wrap justify-center gap-8 mb-12">
      <div className="p-6 rounded-xl w-72 h-48 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-400 dark:bg-gradient-to-r dark:from-green-500 dark:to-green-700">
          <p className="text-black dark:text-white text-center text-lg font-semibold">
            Low rainfall this year has severely affected crop yield, pushing farmers into economic distress.
          </p>
        </div>
        <div className="p-6 rounded-xl w-72 h-48 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out bg-gradient-to-r from-emerald-400 to-lime-600 hover:from-lime-600 hover:to-emerald-400 dark:bg-gradient-to-r dark:from-green-500 dark:to-green-700">
          <p className="text-black dark:text-white text-center text-lg font-semibold">
            Farmers struggle to sell crops at fair prices due to the fluctuating market conditions.
          </p>
        </div>
        <div className="p-6 rounded-xl w-72 h-48 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out bg-gradient-to-r from-green-400 to-lime-500 hover:from-lime-500 hover:to-green-400 dark:bg-gradient-to-r dark:from-green-500 dark:to-green-700">
          <p className="text-black dark:text-white text-center text-lg font-semibold">
            Farmer suicides increase as debt piles up with little government support reaching them.
          </p>
        </div>
        <div className="p-6 rounded-xl w-72 h-48 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out bg-gradient-to-r from-lime-300 to-green-500 hover:from-green-500 hover:to-lime-300 dark:bg-gradient-to-r dark:from-green-500 dark:to-green-700">
          <p className="text-black dark:text-white text-center text-lg font-semibold">
            Our mission is to bring hope and financial aid to farmers in need. Let's work together!
          </p>
        </div>
        {/* Your content cards here */}
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform hover:scale-105 transition duration-500 ease-in-out dark:bg-slate-800">
        <h2 className="text-green-700 dark:text-white text-3xl font-bold mb-6 text-center">Support Our Farmers</h2>

        <input
          type="text"
          placeholder="Enter amount"
          value={paisa}
          onChange={(e) => setPaisa(e.target.value)}
          className="w-full p-4 mb-6 rounded-md border-2 border-green-300 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
        />

        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-4 mb-6 rounded-md border-2 border-green-300 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
        />

        <button
          className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          onClick={handlePayment}
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}

export default Donation;
