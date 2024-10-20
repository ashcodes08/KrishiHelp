import React, { useState, useEffect } from 'react';
import linksInfo from './LinksInfo';
const LinksSection = () => {
  const [vislinks, setVislinks] = useState([]);

  useEffect(() => {
    if (linksInfo.length > 0) {
      setVislinks(linksInfo.slice(0, 3));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (linksInfo.length > 0) {
        setVislinks((prevVisible) => {
          const nextInd = (linksInfo.indexOf(prevVisible[0]) + 1) % linksInfo.length;
          const nextVisible = linksInfo.slice(nextInd, nextInd + 3);
          return nextVisible.length < 3
            ? [...nextVisible, ...linksInfo.slice(0, 3 - nextVisible.length)]
            : nextVisible;
        });
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-yellow-200 text-black py-4 dark:text-white dark:bg-slate-800 rounded-md">
      <h2 className="text-center text-3xl font-bold mb-4">Important Links</h2>
      <div className="flex items-center justify-between px-8 mx-6">
        {vislinks.length > 0 &&
          vislinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform transform hover:scale-110"
            >
              <img
                src={link.image}
                alt={`Link ${index}`}
                className="h-40 w-60 object-contain"
              />
            </a>
          ))}
      </div>
    </div>
  );
};

export default LinksSection;
