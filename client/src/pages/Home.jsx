import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import News from '../components/News';
import LinksSection from '../components/LinksSection';
import Schemes from '../components/Schemes';
import SuccessStories from '../components/SuccessStories';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <div >
      
      <div >
        {/* Intro */}
        <div
          className='flex flex-col gap-6 p-20 px-3 pw max-w-screen mx-auto mb-10 text-center'
          style={{
            backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/857/346/desktop-wallpaper-agriculture-and-agriculture.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '600px',
            width: '100vw',
          }}
        >
          <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg mt-none bg-white bg-opacity-80">
            <h1 className='text-4xl font-bold lg:text-6xl text-gray-700 mb-5'>Welcome to Krishi-Help</h1>
            <p className='text-gray-800 text-lg font-semibold max-w-150'>
              Your trusted partner in agriculture, bridging the gap between distributors and farmers. 
              At Krishi-Help, we empower farmers with easy access to quality products and services, 
              ensuring a sustainable and prosperous agricultural community. 
              Join us in revolutionizing farming through innovation.
            </p>
            <Link to='/about'>
              <button className="mt-10 px-6 py-3 bg-teal-500 text-white font-bold rounded hover:bg-teal-600 transition duration-200">
                Know More About Us
              </button>
            </Link>
          </div>
        </div>

        {/* News Section for non-farmers */}
        {currentUser && !currentUser.isFarmer && (
          <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-6 rounded-lg mb-8 max-w-5xl mx-auto">
            <News />
          </div>
        )}

        {/* News and Schemes Section for Farmers */}
        {(!currentUser || currentUser.isFarmer) && (
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-6 rounded-lg flex-1 hover:shadow-lg transition-shadow duration-300">
              <News />
            </div>
            <div className="bg-gradient-to-r from-green-300 to-green-500 p-6 rounded-lg flex-1 hover:shadow-lg transition-shadow duration-300">
              <Schemes />
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-6"></div>

        {/* Recent Posts Section for Farmers */}
        <div className='max-w-6xl mx-auto p-3 py-7'>
          {currentUser && currentUser.isFarmer && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={'/search'}
                className='text-lg text-teal-500 hover:underline text-center'
              >
                View all posts
              </Link>
            </div>
          )}
        </div>

        {/* Success Stories Section */}
        <div className="bg-gradient-to-r from-green-100 via-green-300 to-green-500 p-10">
          <h2 className="text-4xl font-bold text-center mb-10 dark:text-gray-800">Success Stories</h2>
          <SuccessStories />
        </div>
        
        <div className='py-4'>
          <LinksSection />
        </div>
      </div>
    </div>
  );
}
