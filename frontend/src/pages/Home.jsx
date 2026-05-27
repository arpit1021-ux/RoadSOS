import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className={`text-center mb-12 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-5xl md:text-7xl font-extrabold text-emergency mb-4 tracking-tight">
          🚗 RoadSoS AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2">
          Intelligent Emergency Response System
        </p>
        <p className="text-gray-400 max-w-md mx-auto">
          Fast, reliable emergency assistance for road accidents. No login required for emergencies.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col items-center justify-center py-16">

  <button
    onClick={() => navigate("/sos")}
    className="w-72 h-72 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-[0_0_80px_rgba(255,0,0,0.6)] animate-pulse flex flex-col items-center justify-center"
  >

    <span className="text-8xl mb-4">
      🚨
    </span>

    <span className="text-2xl font-extrabold text-white">
      SOS
    </span>

  </button>

  <p className="text-gray-300 mt-8 text-xl text-center max-w-xl">
    Tap once for immediate emergency assistance,
    ambulance dispatch, and nearby trauma center coordination.
  </p>

</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-md">
        {/* <Link to="/sos" className="glass rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emergency/50">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-emergency mb-2">EMERGENCY SOS</h2>
          <p className="text-gray-400 text-sm">Instant help, no questions asked</p>
        </Link> */}

        <Link to="/services" className="glass rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emergency/50">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-1xl font-bold text-emergency mb-2">FIND NEARBY HELP</h2>
          <p className="text-gray-400 text-sm">Locate hospitals, police, ambulances</p>
        </Link>

        <Link to="/report" className="glass rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emergency/50">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-1xl font-bold text-emergency mb-2">REPORT ACCIDENT</h2>
          <p className="text-gray-400 text-sm">Witness assistance mode</p>
        </Link>

        <Link to="/login" className="glass rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-1xl font-bold text-white mb-2">LOGIN / PROFILE</h2>
          <p className="text-gray-400 text-sm">Unlock personalized features</p>
        </Link>
      </div>
    </div>
  );
}
