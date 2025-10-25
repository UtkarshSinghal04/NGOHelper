import React, { useState } from 'react';

/**
 * Report Submission page component
 * Allows NGOs to submit individual monthly reports
 * Form includes all required fields and logs data to console on submission
 */
const ReportSubmission = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    ngoId: '',
    month: '',
    year: new Date().getFullYear(),
    peopleHelped: 0,
    eventsConducted: 0,
    fundsUtilized: 0,
  });

  // State to manage form submission status
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle input changes and update form state
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Fields that must be numeric
    const numericFields = ['peopleHelped', 'eventsConducted', 'fundsUtilized', 'year'];
  
    // If it's a numeric field, validate input
    if (numericFields.includes(name)) {
      if (value === '' || /^[0-9]+$/.test(value)) {
        // valid number (or empty string while typing)
        setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
      } else {
        alert('Please enter a valid number');
        setFormData(prev => ({ ...prev, [name]: 0 }));
      }
    } else {
      // normal text field
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

  /**
   * Handle form submission
   * Submits form data to backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Report submitted successfully:', result.data);
        setIsSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            ngoId: '',
            month: '',
            year: new Date().getFullYear(),
            peopleHelped: 0,
            eventsConducted: 0,
            fundsUtilized: 0,
          });
        }, 3000);
      } else {
        console.error('Report submission failed:', result.message);
        alert('Failed to submit report: ' + result.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Monthly Report Submission</h1>
        
        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Report submitted successfully! Thank you for your submission.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NGO ID */}
          <div>
            <label htmlFor="ngoId" className="block text-sm font-medium text-gray-700 mb-2">
              NGO ID *
            </label>
            <input
              type="text"
              id="ngoId"
              name="ngoId"
              value={formData.ngoId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your NGO ID"
            />
          </div>

          {/* Month and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Month *
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="2020"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* People Helped */}
          <div>
            <label htmlFor="peopleHelped" className="block text-sm font-medium text-gray-700 mb-2">
              Number of People Helped *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="peopleHelped"
              name="peopleHelped"
              value={formData.peopleHelped}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of people helped"
            />
          </div>

          {/* Events Conducted */}
          <div>
            <label htmlFor="eventsConducted" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Events Conducted *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="eventsConducted"
              name="eventsConducted"
              value={formData.eventsConducted}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of events conducted"
            />
          </div>

          {/* Funds Utilized */}
          <div>
            <label htmlFor="fundsUtilized" className="block text-sm font-medium text-gray-700 mb-2">
              Funds Utilized (₹) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="fundsUtilized"
              name="fundsUtilized"
              value={formData.fundsUtilized}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount of funds utilized"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Submit Report
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            If you have any questions about filling out this form or need assistance with your NGO ID, 
            please contact our support team through the Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportSubmission;
