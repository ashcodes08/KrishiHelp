import { useEffect, useState } from 'react';
import SchemeCard from './SchemeCard'; 
import schemeData from './SchemesLink';  

const Schemes = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      setData(schemeData);  
    } catch (error) {
      setError('Failed to load schemes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div id="schemes" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">Schemes Section</h4>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mini-scheme-cards flex flex-col gap-2">
        {!isLoading ? (
          data.map((scheme, index) => (
            <SchemeCard
              schemeName={scheme.schemeName}
              publishedDate={scheme.date}
              schemeUrl={scheme.link}
              key={index}
            />
          ))
        ) : (
          <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Schemes;