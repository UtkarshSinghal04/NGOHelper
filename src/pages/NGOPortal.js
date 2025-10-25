import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const NGOPortal = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === `/ngo-portal${path}`;

  return (
    <>
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side — Logo + Nav links */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">NGO Helper</h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="reports"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/reports')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Report Submission
                </Link>
                <Link
                  to="bulk-upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/bulk-upload')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Bulk Upload
                </Link>
                <Link
                  to="contact"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/contact')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Contact
                </Link>
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

export default NGOPortal;
