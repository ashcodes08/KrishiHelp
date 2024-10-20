import React, { useState } from 'react';
import axios from 'axios';
import ShopCard from './ShopCard';

const ShopSearch = () => {
  const [city, setCity] = useState('');
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20; 

  const fetchShops = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/shops', {
        params: { city },
      });
      const { data } = response;
      if (data.success) {
        setShops(data.shops);
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch shops. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShops([]);
    setPage(1);
    fetchShops();
  };

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchShops(newPage); 
    }
  };

  const handleNext = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchShops(newPage); 
  };

  return (
    <div className="shop-search-page flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 ">Find Agriculture Shops</h1>
      <form onSubmit={handleSearch} className="flex flex-col items-center mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-64 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-black"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200"
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="my-10 cards flex flex-wrap justify-center gap-4">
        {!isLoading ? (
          shops.map((shop, index) => (
            <ShopCard shop={shop} key={index} />
          ))
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>

      
    </div>
  );
};

export default ShopSearch;
