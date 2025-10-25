import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminPortal = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === `/admin-portal${path}`;

  return (
    <>
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side — Logo + Nav links */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">NGO Helper - Admin</h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {/* <Link
                  to="dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-500 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link> */}
              </div>
            </div>

            {/* Right side — Back to Home button */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-blue-100 hover:text-white px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <Outlet />
    </>
  );
};

export default AdminPortal;
