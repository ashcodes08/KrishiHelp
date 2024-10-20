import React from 'react';
import Objectives from '../components/Objectives';
import { Link } from 'react-router-dom';

function About() {
  return (
    <>
      <Objectives />
      <div className="bg-gray-100 p-6 rounded-lg text-center dark:bg-slate-700">
        <p className="text-lg mb-4">
          If you would like to support our cause and help farmers in need, 
          please consider making a donation through our portal.
        </p>
        <Link 
          to="/donation-portal" 
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Donate Now
        </Link>
      </div>
    </>
  );
}

export default About;
