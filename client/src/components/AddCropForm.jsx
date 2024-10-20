import { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import cropSuggestions from './CropSuggestions';

export default function AddCropForm({ onAddCrop }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggestion = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setName(val);

    if (val) {
      const filtered = cropSuggestions.filter((crop) =>
        crop.toLowerCase().startsWith(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && quantity && price && category) {
      const newCrop = { name, quantity: parseInt(quantity), price: parseInt(price), category };
      onAddCrop(newCrop); // Call parent function to add crop
      setName('');
      setQuantity('');
      setPrice('');
      setCategory('');
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-md dark:bg-slate-800 relative">
      <h2 className="text-lg font-semibold">Add New Crop</h2>

      <div>
        <Label htmlFor="name" value="Crop Name" />
        <TextInput
          id="name"
          placeholder="Enter crop name"
          value={name}
          required
          onChange={handleChange}
        />

        {/* Dropdown fro crop name suggestions */}
        {suggestions.length > 0 && (
          <ul className='absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full'>
            {suggestions.map((suggestion) => (
              <li className='cursor-pointer hover:bg-gray-400 p-2' key={suggestion} onClick={() => handleSuggestion(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label htmlFor="quantity" value="Quantity (Kg)" />
        <TextInput
          id="quantity"
          placeholder="Enter quantity in Kg"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="price" value="Price per Kg" />
        <TextInput
          id="price"
          placeholder="Enter price per Kg"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="category" value="Category" />
        <TextInput
          id="category"
          placeholder="Enter crop category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <Button gradientDuoTone="purpleToPink" type="submit">
        Add Crop
      </Button>
    </form>
  );
}
