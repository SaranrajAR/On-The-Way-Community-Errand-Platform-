import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path ? "text-blue-500 font-bold" : "text-gray-300 hover:text-white";

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </div>
            <Link to="/" className="text-xl font-black tracking-tighter text-white">
              ON THE WAY
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm tracking-wide transition-colors ${isActive('/')}`}>
              HOME
            </Link>
            <Link to="/notification" className={`text-sm tracking-wide transition-colors ${isActive('/notification')}`}>
              NOTIFICATIONS
            </Link>
            <Link to="/profile" className={`text-sm tracking-wide transition-colors ${isActive('/profile')}`}>
              PROFILE
            </Link>
            
            <button 
              onClick={logout} 
              className="btn btn-ghost btn-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold border border-transparent hover:border-red-500/20"
            >
              LOGOUT
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-circle text-white"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (DROPDOWN) */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-gray-800 border-t border-gray-700 shadow-2xl">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            HOME
          </Link>
          <Link to="/notification" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            NOTIFICATIONS
          </Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            PROFILE
          </Link>
          <button 
            onClick={logout} 
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;