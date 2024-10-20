import React, { useState } from 'react';
import { Button, Badge, Card } from 'flowbite-react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { GiPlantWatering } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';

export default function CropCard({ crop }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();

  const increment = () => {
    if (quantity < crop.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAdd = () => {
    dispatch(addToCart({ id: crop._id, qty: quantity }));
  };

  return (
    <div className="p-4">
      <Card className="flex flex-col gap-4 w-full dark:bg-slate-800 rounded-md shadow-md min-w-[250px]">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-md uppercase">{crop.name}</h3>
            <p className="text-xl font-semibold">{crop.quantity} Kg</p>
          </div>
          <GiPlantWatering className="text-teal-600 text-3xl" />
        </div>
        <p className="text-gray-500">Price per Kg: ₹{crop.pricePerKg}</p>
        <p className="text-gray-500">Category: {crop.type}</p>
        <p className="text-gray-500">Farmer ID: {crop.userId}</p>

        <div className="flex flex-wrap gap-2">
          <Badge color="success">Organic</Badge>
          <Badge color="info">Fresh</Badge>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <Button
            onClick={decrement}
            color="gray"
            disabled={quantity === 0}
            className="flex items-center justify-center p-2 w-[20%]"
          >
            <AiOutlineMinus className="text-lg" />
          </Button>
          <input
  type="number"
  value={quantity}
  onChange={(e) => {
    const value = e.target.value;
    const maxQuantity = crop.quantity; // Set your desired maximum quantity here
    if (Number(value) <= maxQuantity) {
      setQuantity(Number(value));
    }
  }}
  className="bg-transparent text-center w-16 text-xl outline-none"
/>

          <Button
            onClick={increment}
            color="gray"
            disabled={quantity === crop.quantity}
            className="flex items-center justify-center p-2 w-[20%]"
          >
            <AiOutlinePlus className="text-lg" />
          </Button>
          <Button
            onClick={handleAdd}
            color="gray"
            disabled={quantity === 0}
            className="flex items-center justify-center p-2 w-[20%]"
          >
            Add to cart
          </Button>
        </div>
      </Card>
    </div>
  );
}
