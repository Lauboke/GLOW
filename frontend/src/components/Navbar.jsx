import React, { useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate(); // For programmatic navigation

  // 3. Added Auth Check

  const userToken = localStorage.getItem("userToken");

  // 4. Added Logout Function

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    localStorage.removeItem("userName");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}

          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Floral Wreath Circle SVG */}

              <svg
                className="absolute inset-0 w-full h-full text-pink-400 opacity-60 animate-spin-slow"
                viewBox="0 0 100 100"
              >
                <path
                  d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />

                <circle cx="50" cy="10" r="3" fill="currentColor" />

                <circle cx="90" cy="50" r="3" fill="currentColor" />

                <circle cx="50" cy="90" r="3" fill="currentColor" />

                <circle cx="10" cy="50" r="3" fill="currentColor" />
              </svg>

              <span className="text-2xl font-serif font-bold text-pink-700">
                G
              </span>
            </div>

            <span className="text-xl font-bold tracking-[0.2em] text-gray-800 group-hover:text-pink-600 transition">
              GLOW
            </span>
          </NavLink>

          {/* Desktop Menu & Auth Buttons TOGETHER */}

          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              Book Now
            </NavLink>

            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              Reviews
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              Contact
            </NavLink>

            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `font-bold text-sm transition-colors pr-2 ${
                  isActive
                    ? "text-pink-500"
                    : "text-gray-600 hover:text-pink-500"
                }`
              }
            >
              FAQ
            </NavLink>

            

            

            <div className="pl-4 ml-2 border-l border-gray-200 flex items-center space-x-3">
              {userToken ? (
                <>
                  {/* NEW PROFILE BUTTON */}

                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left text-pink-600 hover:bg-pink-50 px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest"
                  >
                    My Profile
                  </NavLink>

                  <button
  onClick={handleLogout}
  className="inline-flex items-center justify-center min-w-[100px] shrink-0 text-gray-500 hover:text-red-500 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-colors cursor-pointer"
>
  Sign Out
</button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md transition-all"
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pink-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
  to="/"
  end
  onClick={() => setIsOpen(false)}
  className={({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? "text-pink-500 bg-pink-50"
        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
    }`
  }
>
  Home
</NavLink>

            <NavLink
              to="/gallery"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`
              }
            >
              Services
            </NavLink>

            <NavLink
  to="/booking"
  onClick={() => setIsOpen(false)}
  className={({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
    }`
  }
>
  Book Now
</NavLink>

            <NavLink
              to="/reviews"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`
              }
            >
              Reviews
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`
              }
            >
              Contact
            </NavLink>

            <NavLink
              to="/faq"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`
              }
            >
              FAQ
            </NavLink>

            {/* Mobile Auth Buttons */}

            <div className="pt-4 mt-2 border-t border-gray-100">
              {userToken ? (
                <>
                  {/* NEW PROFILE BUTTON (MOBILE) */}

                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left text-pink-600 hover:bg-pink-50 px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest"
                  >
                    My Profile
                  </NavLink>

                  <button
                    onClick={() => {
                      handleLogout();

                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-400 hover:bg-red-50 hover:text-red-500 px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-black text-white hover:bg-gray-800 px-3 py-3 mx-2 mt-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Sign In / Join
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
