import React from 'react';

const FetchTrends = () => {
  const backgroundImageUrl = "https://img.freepik.com/premium-photo/tractor-is-field-with-sunset-background_862462-19892.jpg"; 

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-8 shadow-lg rounded-lg text-center w-full max-w-5xl dark:bg-slate-800">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Understanding Agricultural Market Trends
        </h1>
        <p className="text-lg text-gray-800 mb-8 dark:text-white">
          Market trends refer to the general movement of prices and demand in the agricultural sector over time. They help farmers and traders make informed decisions about buying and selling crops, determining the right time for harvest, and anticipating future market conditions.
        </p>
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Useful Resources for Crop Price Trends
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <a
            href="https://agmarknet.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white py-4 px-6 rounded hover:bg-green-600 transition duration-300"
          >
            Agmarknet
          </a>
          <a
            href="https://www.enam.gov.in/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white py-4 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            eNAM
          </a>
        </div>
      </div>
    </div>
  );
};

export default FetchTrends;
