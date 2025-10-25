import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value));
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleViewSummary = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/report/dashboard?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
      );

      const result = await response.json();

      if (result.success) {
        setSummaryData(result.data);
        setCurrentPage(1);
      } else {
        setError(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatNumber = (num) => num.toLocaleString('en-IN');
  const formatCurrency = (amount) => `₹${formatNumber(amount)}`;

  // Pagination + sorting
  let totalPages = 1;
  let currentRows = [];
  if (summaryData) {
    let sortedData = [...summaryData.ngoReports];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  }

  const SortableHeader = ({ label, field }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
    >
      {label}
      {sortConfig.key === field && (
        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
      )}
    </th>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Month and Year</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-32">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                min="2020"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <button
                onClick={handleViewSummary}
                disabled={isLoading}
                className={`px-6 py-2 rounded-md font-medium ${
                  isLoading
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {isLoading ? 'Loading...' : 'View Summary'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
        )}

        {summaryData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-sm font-medium text-blue-600">NGOs Reporting</p>
                <p className="text-2xl font-bold text-blue-900">{summaryData.totalNGOsReporting}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-sm font-medium text-green-600">People Helped</p>
                <p className="text-2xl font-bold text-green-900">{formatNumber(summaryData.totalPeopleHelped)}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Events Conducted</p>
                <p className="text-2xl font-bold text-purple-900">{formatNumber(summaryData.totalEventsConducted)}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-sm font-medium text-orange-600">Funds Utilized</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(summaryData.totalFundsUtilized)}</p>
              </div>
            </div>

            {/* NGO Reports Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  NGO Reports for {summaryData.month} {summaryData.year}
                </h3>

                {/* Rows per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader label="NGO ID" field="ngoId" />
                      <SortableHeader label="NGO Name" field="ngoName" />
                      <SortableHeader label="People Helped" field="peopleHelped" />
                      <SortableHeader label="Events Conducted" field="eventsConducted" />
                      <SortableHeader label="Funds Utilized" field="fundsUtilized" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.ngoId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.ngoName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(report.peopleHelped)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(report.eventsConducted)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(report.fundsUtilized)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {summaryData.ngoReports.length > rowsPerPage && (
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md font-medium ${
                      currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md font-medium ${
                      currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {summaryData.ngoReports.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No NGO reports were submitted for {summaryData.month} {summaryData.year}.
              </div>
            )}
          </div>
        )}

        {!summaryData && !isLoading && !error && (
          <div className="text-center py-12 text-gray-500">
            Select a month and year to view the summary dashboard.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
