import { useState, useEffect } from 'react';

const successStories = [
  {
    image: 'https://t4.ftcdn.net/jpg/05/95/55/89/360_F_595558921_z1JnF4ieH75XlWoDPuh1Os97QkPnb4dx.jpg',
    title: 'Empowering Farmers in Rural India',
    description: 'This initiative helped thousands of farmers in rural India increase productivity and income.',
  },
  {
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVY7CqU6bge4s9D9JJjbPTB5VRUlAHNylW6dH4rIxZ7UAiCCX20KGNXDercsCpxAMYhcxuhaohC58xDYzvOUWXSxGlxswDvR1Mk-XAJ51VvM4hCsYJzjNgLyKh4lrltVvOYSzywLZpXhTL/w0/Sustainable+Agriculture+wale+chacha.jpg',
    title: 'Sustainable Farming Practices',
    description: 'A successful journey towards adopting sustainable farming practices that reduced costs by 20%.',
  },
  {
    image: 'https://assets.entrepreneur.com/content/3x2/2000/1676041382-GettyImages-1395122379.jpg',
    title: 'Digital Revolution in Agriculture',
    description: 'Introducing modern technology in the farming community has significantly improved overall efficiency.',
  },
  // Add more stories here
];

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % successStories.length);
    }, 5000); // Automatically change slides every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider container */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {successStories.map((story, index) => (
          <div key={index} className="min-w-full h-[550px] relative">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${story.image})` }}
            />
            <div className="absolute bottom-0 left-0 p-8 bg-black bg-opacity-50 w-full text-white">
              <h2 className="text-3xl font-bold">{story.title}</h2>
              <p className="mt-4 text-lg">{story.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex((currentIndex - 1 + successStories.length) % successStories.length)}
          className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
        >
          &#8592;
        </button>
        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % successStories.length)}
          className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
        >
          &#8594;
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        {successStories.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 mx-1 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-500'} cursor-pointer`}
          />
        ))}
      </div>
    </div>
  );
}
