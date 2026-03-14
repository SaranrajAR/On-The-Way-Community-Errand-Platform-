import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Car, Users, Zap } from 'lucide-react'; // Using lucide-react for icons

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 flex flex-col items-center text-center">
        <div className="space-y-4 mb-12">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            Share your path, <span className="text-blue-500">save the way.</span>
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
            The community ride-share app for your apartment. Pick up a neighbor, 
            split the cost, and make your daily commute better.
          </p>
        </div>

        {/* THE "WHERE ARE YOU GOING" WINDOW */}
        <div className="w-full max-w-lg bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl transform transition hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <MapPin className="text-blue-500" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-left">Where are you heading today?</h2>
          </div>

          <p className="text-gray-400 text-left mb-8 text-sm">
            Post your destination and find neighbors who are going in the same direction.
          </p>

          <button 
            onClick={() => navigate("/ride")} // Using /ride as per the map logic, or change to "/route" if your router is set that way
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2 group"
          >
            Start a Journey
            <Zap className="fill-current group-hover:animate-pulse" size={20} />
          </button>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 text-left">
            <Car className="text-green-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Post Your Ride</h3>
            <p className="text-gray-400 text-sm">Mark your destination on the map and set your departure time.</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 text-left">
            <Users className="text-purple-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Get Matched</h3>
            <p className="text-gray-400 text-sm">Neighbors in your building can see your route and request to join.</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 text-left">
            <MapPin className="text-red-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Travel Together</h3>
            <p className="text-gray-400 text-sm">Pick them up at the lobby and enjoy a shared, eco-friendly ride.</p>
          </div>
        </div>
      </main>

      {/* DECORATIVE BACKGROUND GRADIENT */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default HomePage;