const ShopCard = ({ shop }) => {
  return (
    <div className="shop-card bg-white p-4 shadow-md rounded-lg flex flex-col items-start h-64 w-64 overflow-auto dark:bg-gray-500">
      <h3 className="font-bold text-lg mb-2 dark:text-white ">{shop.name}</h3>
      <p className="text-gray-600 mb-2 dark:text-white ">Address: {shop.address}</p>
      <p className="text-gray-600 mb-4 dark:text-white">Phone: {shop.phoneNumber}</p>

      {shop.website !== "Not available" && (
        <a
          href={shop.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline mt-auto font-bold"
        >
          Visit Website
        </a>
      )}
    </div>
  );
};

export default ShopCard;
