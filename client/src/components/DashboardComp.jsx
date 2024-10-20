import { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineUserGroup, HiPlusCircle } from 'react-icons/hi';
import CropCard from './CropCard';
import cropSuggestions from './CropSuggestions';

export default function DashboardComp() {
  const [crops, setCrops] = useState([]);
  const [totalCrops, setTotalCrops] = useState(0);
  const [newCrop, setNewCrop] = useState({ name: '', type: '', quantity: '', pricePerKg: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch('/api/crop/getCrops');
        const data = await res.json();
        if (res.ok) {
          const filteredCrops = data.crops.filter((crop) => crop.quantity > 0);
          setCrops(filteredCrops);
          setTotalCrops(filteredCrops.length);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCrops();
  }, []);

  const handleUpdateQuantity = async (cropId, newQuantity) => {
    try {
      await fetch(`/api/crop/updateQuantity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropId, quantity: newQuantity }),
      });

      setCrops((prevCrops) => {
        const updatedCrops = prevCrops
          .map((crop) =>
            crop._id === cropId ? { ...crop, quantity: newQuantity } : crop
          )
          .filter((crop) => crop.quantity > 0);

        setTotalCrops(updatedCrops.length);
        return updatedCrops;
      });
    } catch (error) {
      console.log('Failed to update quantity:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop({
      ...newCrop,
      [name]: value,
    });

    if (name === 'name') {
      const filtered = cropSuggestions.filter(crop =>
        crop.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }

    if (name === 'name' && value.trim() === '') {
      setFilteredSuggestions([]);
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();

    const cropExists = crops.some((crop) => crop.name.toLowerCase() === newCrop.name.toLowerCase());
    if (cropExists) {
      setErrorMessage('Crop already in inventory');
      return;
    }

    try {
      const res = await fetch('/api/crop/addCrop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCrop),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.crop.quantity > 0) {
          setCrops([...crops, data.crop]);
          setTotalCrops(totalCrops + 1);
        }
        setNewCrop({ name: '', type: '', quantity: '', pricePerKg: '' });
        setIsModalOpen(false);
        setErrorMessage('');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setErrorMessage('');
    setFilteredSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewCrop({ ...newCrop, name: suggestion });
    setFilteredSuggestions([]);
  };

  const handleUpdatePrice = async (cropId, newPrice) => {
    try {
      await fetch(`/api/crop/updatePrice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropId, pricePerKg: newPrice }),
      });

      setCrops((prevCrops) => 
        prevCrops.map((crop) => 
          crop._id === cropId ? { ...crop, pricePerKg: newPrice } : crop
        )
      );
    } catch (error) {
      console.log('Failed to update price:', error.message);
    }
  };
  const cropTypes = ["Vegetables", "Fruits", "Grains", "Medicinal", "Oilseeds", "Fiber based", "Herbs", "Other"];

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-2">
          <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          <div>
            <h3 className="text-gray-500 text-md uppercase">Total Crops</h3>
            <p className="text-2xl">{totalCrops}</p>
          </div>
        </div>
        <div>
          <Button onClick={toggleModal} outline gradientDuoTone="purpleToPink" className="flex items-center gap-2">
            <HiPlusCircle className='mt-1 mr-1' />
            <span>Add New Crop</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {crops.map((crop) => (
          <CropCard key={crop._id} crop={crop} onUpdateQuantity={handleUpdateQuantity} onUpdatePrice={handleUpdatePrice}/>
        ))}
      </div>

      <Modal show={isModalOpen} onClose={toggleModal}>
        <Modal.Header>Add a New Crop</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddCrop} className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Crop Name
              </label>
              <input
                type="text"
                name="name"
                value={newCrop.name}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
              {filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {filteredSuggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      role="option"
                      aria-selected="false"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Crop Type
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 block w-full border rounded-md mt-1 text-left"
              >
                {newCrop.type || 'Select Crop Type'}
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto w-full">
                  {cropTypes.map((type) => (
                    <li
                      key={type}
                      onClick={() => {
                        setNewCrop({ ...newCrop, type });
                        setIsDropdownOpen(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={newCrop.quantity}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700">
                Price per Kg
              </label>
              <input
                type="number"
                name="pricePerKg"
                value={newCrop.pricePerKg}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            <Button type="submit" gradientDuoTone="purpleToPink">
              Add Crop
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
