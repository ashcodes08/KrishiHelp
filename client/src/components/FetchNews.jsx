import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import { Spinner } from 'flowbite-react';

const FetchNews = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function handlePrev() {
    if (page > 1) setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
  }

  const pageSize = 12;
  const filterArticles = (articles) => {
    return articles.filter(article => article.title && article.title !== '[Removed]');
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetch(`/api/newsfetched/all-news?page=${page}&pageSize=${pageSize}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(myJson => {
        if (myJson.success) {
          const filteredarticles = filterArticles(myJson.data.articles);
          setTotalResults(myJson.data.totalResults);
          setData(filteredarticles);
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
  }, [page]);

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className='my-10 cards flex flex-wrap justify-center gap-4'>
        {!isLoading ? data.map((element, index) => (
          <NewsCard
            title={element.title}
            description={element.description}
            imgUrl={element.urlToImage}
            publishedAt={element.publishedAt}
            url={element.url}
            author={element.author && element.author.trim()!==""?element.author:"Not available"}
            source={element.source.name}
            key={index}
          />
        )) : <Spinner />}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className='pagination-btn text-center' onClick={handlePrev}>&larr; Prev</button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button className='pagination-btn text-center' disabled={page >= Math.ceil(totalResults / pageSize)} onClick={handleNext}>Next &rarr;</button>
        </div>
      )}
    </>
  );
}

export default FetchNews;
