import React from 'react';

function Loader() {
  return (
    <div className='loader-container w-full h-screen flex flex-col justify-center items-center bg-white'>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Farmers: Sowing Seeds, Feeding Souls!</h2>
        <span className="loader"></span>
    </div>
  );
}

export default Loader;
