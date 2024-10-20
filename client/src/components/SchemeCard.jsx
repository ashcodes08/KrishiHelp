import React from 'react';

const SchemeCard = ({ schemeName, publishedDate, schemeUrl }) => {
  return (
    <div className="mini-scheme-card bg-yellow-200 dark:bg-slate-500 dark:hover:bg-slate-700 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <b className="scheme-name font-semibold text-lg">{schemeName}</b>
        <a 
          href={schemeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="scheme-link underline ml-2"
        >
          View Scheme
        </a>
      </div>
      <p className="published-date text-sm mt-1">
        <span className="font-semibold">Published Date:</span> {publishedDate}
      </p>
    </div>
  );
};

export default SchemeCard;
