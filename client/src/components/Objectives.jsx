import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake, faListUl, faHeart, faBullhorn, faSeedling } from "@fortawesome/free-solid-svg-icons";

const Objectives = () => {
  return (
    <div>
      {/* Background Video Section */}
      <div className="relative h-screen">
        <iframe
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://player.vimeo.com/video/274986674?autoplay=1&muted=1&loop=1&background=1"
          frameBorder="0"
          allow="autoplay; fullscreen; muted"
          allowFullScreen
          title="Vimeo Video"
        ></iframe>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white p-8">
            <h1 className="text-5xl font-bold mb-4">Empowering Farmers, Enabling Growth</h1>
            <p className="text-lg max-w-2xl mx-auto">
              We started this platform to bridge the gap between farmers and distributors, giving farmers the opportunity to sell crops directly, ensuring fairer prices.
              Our goal is to make agriculture more sustainable by providing a centralized platform with real-time market trends, government schemes, and a donation portal to support farmers in need.
            </p>
          </div>
        </div>
      </div>

      {/* Objectives Section */}
      <div className="py-12 bg-gradient-to-r from-green-200 to-green-400 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg dark:bg-slate-700">
          <h2 className="text-center text-3xl font-semibold mb-10 ">Our Objectives</h2>
          <div className="flex flex-wrap justify-around items-center gap-8">
            <div className="section p-4 text-center max-w-xs">
              <FontAwesomeIcon icon={faHandshake} className="text-6xl mb-4 text-green-600" />
              <h4 className="text-xl font-bold">Improve Farmer Income</h4>
              <p>Help farmers sell their crops directly to distributors, increasing their earnings.</p>
            </div>
            <div className="section p-4 text-center max-w-xs">
              <FontAwesomeIcon icon={faListUl} className="text-6xl mb-4 text-green-600" />
              <h4 className="text-xl font-bold">Transparent Market Information</h4>
              <p>Provide farmers with real-time market trends and price updates.</p>
            </div>
            <div className="section p-4 text-center max-w-xs">
              <FontAwesomeIcon icon={faHeart} className="text-6xl mb-4 text-green-600" />
              <h4 className="text-xl font-bold">Support Farmers in Need</h4>
              <p>Offer a donation platform to help farmers facing difficulties.</p>
            </div>
            <div className="section p-4 text-center max-w-xs">
              <FontAwesomeIcon icon={faBullhorn} className="text-6xl mb-4 text-green-600" />
              <h4 className="text-xl font-bold">Promote Agricultural Awareness</h4>
              <p>Share news and information about government schemes and agricultural practices.</p>
            </div>
            <div className="section p-4 text-center max-w-xs">
              <FontAwesomeIcon icon={faSeedling} className="text-6xl mb-4 text-green-600" />
              <h4 className="text-xl font-bold">Distribute Market Trends</h4>
              <p>Enable distributors to access crop price trends and support the farming community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objectives;
