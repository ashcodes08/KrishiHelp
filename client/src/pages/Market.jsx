import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { addCrops } from '../redux/cart/cartSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import CropCard from '../components/Crop'; // Assuming you're using CropCard component for crops

export default function Market() {
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState({
    searchTerm: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch all crops or filtered crops based on URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const categoryFromUrl = urlParams.get('category');
    const minPriceFromUrl = urlParams.get('minPrice');
    const maxPriceFromUrl = urlParams.get('maxPrice');

    const isFilterApplied =
      searchTermFromUrl || categoryFromUrl || minPriceFromUrl || maxPriceFromUrl;

    // Update filter data based on URL params if filters are applied
    if (isFilterApplied) {
      setFilterData({
        searchTerm: searchTermFromUrl || '',
        category: categoryFromUrl || '',
        minPrice: minPriceFromUrl || '',
        maxPrice: maxPriceFromUrl || '',
      });
    }

    const fetchCrops = async () => {
      setLoading(true);
      // If no filters applied, fetch all crops
      const searchQuery = isFilterApplied ? urlParams.toString() : '';
      const res = await fetch(`/api/crop/getAllCrops?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCrops(data.crops);
      // setting the crops array into the global store 
      dispatch(addCrops(data.crops));
      setLoading(false);
      setShowMore(data.crops.length === 9); // Adjust based on pagination logic
    };

    fetchCrops();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilterData({ ...filterData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(filterData);
    const searchQuery = urlParams.toString();
    navigate(`/market?${searchQuery}`);
  };

  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    if (id === "quantity" && !/^\d*$/.test(value))
        return;
    setFilterData({ ...filterData, [id]: value });
  }

  const handleShowMore = async () => {
    const numberOfCrops = crops.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfCrops);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/crop/getAllCrops?${searchQuery}`);
    if (!res.ok) return;
    const data = await res.json();
    setCrops([...crops, ...data.crops]);
    setShowMore(data.crops.length === 9);
  };

  const handleReset = async () => {
    // Reset filter state
    setFilterData({
      searchTerm: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });

    // Reset URL parameters to default (i.e., no filters)
    navigate('/market');

    // Fetch all crops again after reset
    setLoading(true);
    const res = await fetch(`/api/crop/getAllCrops`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCrops(data.crops);
    setLoading(false);
    setShowMore(data.crops.length === 9);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Name:</label>
            <TextInput
              placeholder='Search by name...'
              id='searchTerm'
              type='text'
              value={filterData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} value={filterData.category} id='category' className='p-2 rounded-md max-h-60 overflow-y-auto'>
              <option value=''>All Categories</option>
              <option value='Vegetables'>Vegetables</option>
              <option value='Fruits'>Fruits</option>
              <option value='Medicinal'>Medicinal</option>
              <option value='Oilseeds'>Oilseeds</option>
              <option value='Fibers'>Fibers</option>
              <option value='Grains'>Grains</option>
              <option value='Herbs'>Herbs</option>
              <option value='Other'>Other</option>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Min Price:</label>
            <TextInput
              id='minPrice'
              type='text'
              value={filterData.minPrice}
              onChange={handlePriceChange}
              placeholder='0'
            />
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Max Price:</label>
            <TextInput
              id='maxPrice'
              type='text'
              value={filterData.maxPrice}
              onChange={handlePriceChange}
              placeholder='0'
            />
          </div>

          <div className='flex gap-4'>
            <Button type='submit' outline gradientDuoTone='purpleToPink'>
              Apply Filters
            </Button>
            <Button type='button' color='gray' onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Crops results:
        </h1>
        <div className='p-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {!loading && crops.length === 0 && (
            <p className='text-xl text-gray-500'>No crops found.</p>
          )}
          {loading && <p className='text-xl text-gray-500 min-h-64'>Loading...</p>}
          {!loading &&
            crops
              .filter((crop) => crop.quantity > 0) // Filter crops where quantity is greater than 0
              .map((crop) => (
                <div key={crop._id} className='flex flex-col'>
                  <CropCard crop={crop} />
                </div>
              ))}

          
        </div>
      </div>
    </div>
  );
}
