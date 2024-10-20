import React from 'react';

function MiniCard(props) {
  const truncate = (title, maxlen) => {
    if (title.length > maxlen) {
      return title.substring(0, maxlen - 3) + "...";
    }
    return title;
  };

  return (
    <div className={`mini-card flex items-center p-3 mb-4 border rounded-lg shadow-md 
      ${props.darkMode ? 'bg-green-600 text-white' : 'bg-green-300 text-gray-900'}`} // Conditional classes based on darkMode
    >
      <div className="mini-card-img w-20 h-20 flex-shrink-0">
        <img src={props.imgUrl} alt="img" className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="mini-card-info ml-4 flex flex-col">
        <b className="mini-card-title font-semibold text-md">{truncate(props.title, 90)}</b>
        <p className="mini-card-date text-sm">{`Published at: ${props.publishedAt}`}</p>
      </div>
    </div>
  );
}

export default MiniCard;
