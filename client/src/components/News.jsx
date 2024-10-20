import { useEffect, useState } from 'react';
import MiniCard from './MiniCard';
import { Navigate } from 'react-router-dom';

const News = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigate, setNavigate] = useState(false); // State to control navigation

  const filterArticles = (articles) => {
    return articles.filter(article => article.title && article.title !== '[Removed]');
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('/api/newsfetched/all-news?page=1&pageSize=6')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(myJson => {
        if (myJson.success) {
          const filteredArticles = filterArticles(myJson.data.articles);
          setData(filteredArticles);
        } else {
          setError(myJson.message || 'An error occurred');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError('Failed to fetch news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleReadMoreClick = () => {
    setNavigate(true); // Set navigate to true on button click
  };

  if (navigate) {
    return <Navigate to="/news" />; // Redirect to the news page
  }

  return (
    <div
      id="news"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300" // Removed yellow border classes
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-extrabold text-gray-900 dark:text-white">News Section</h4>
        <button 
          className="bg-green-600 hover:bg-green-800 text-white px-5 py-2 rounded-full transition-transform transform hover:scale-105"
          onClick={handleReadMoreClick} // Attach the click handler
        >
          See More News
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mini-cards flex flex-col gap-2">
        {!isLoading ? (
          data.map((element, index) => (
            <MiniCard
              title={element.title}
              imgUrl={element.urlToImage}
              publishedAt={element.publishedAt}
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

export default News;
