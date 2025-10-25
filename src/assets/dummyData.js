/**
 * Dummy data for the NGO Helper application
 * Contains sample report data for different months and NGOs
 * This data simulates what would come from a backend API
 */

/**
 * Sample NGO report data for different months
 * This represents the data that would be stored in the database
 */
export const dummyReports = [
  // January 2024 Reports
  {
    ngoId: 'NGO001',
    ngoName: 'Hope Foundation',
    month: 'January',
    year: 2024,
    peopleHelped: 150,
    eventsConducted: 5,
    fundsUtilized: 25000
  },
  {
    ngoId: 'NGO002',
    ngoName: 'Green Earth Society',
    month: 'January',
    year: 2024,
    peopleHelped: 200,
    eventsConducted: 8,
    fundsUtilized: 30000
  },
  {
    ngoId: 'NGO003',
    ngoName: 'Education for All',
    month: 'January',
    year: 2024,
    peopleHelped: 300,
    eventsConducted: 12,
    fundsUtilized: 45000
  },
  {
    ngoId: 'NGO004',
    ngoName: 'Women Empowerment Center',
    month: 'January',
    year: 2024,
    peopleHelped: 120,
    eventsConducted: 6,
    fundsUtilized: 20000
  },
  {
    ngoId: 'NGO005',
    ngoName: 'Child Care Foundation',
    month: 'January',
    year: 2024,
    peopleHelped: 180,
    eventsConducted: 4,
    fundsUtilized: 35000
  },

  // February 2024 Reports
  {
    ngoId: 'NGO001',
    ngoName: 'Hope Foundation',
    month: 'February',
    year: 2024,
    peopleHelped: 175,
    eventsConducted: 6,
    fundsUtilized: 28000
  },
  {
    ngoId: 'NGO002',
    ngoName: 'Green Earth Society',
    month: 'February',
    year: 2024,
    peopleHelped: 220,
    eventsConducted: 9,
    fundsUtilized: 32000
  },
  {
    ngoId: 'NGO003',
    ngoName: 'Education for All',
    month: 'February',
    year: 2024,
    peopleHelped: 280,
    eventsConducted: 10,
    fundsUtilized: 42000
  },
  {
    ngoId: 'NGO004',
    ngoName: 'Women Empowerment Center',
    month: 'February',
    year: 2024,
    peopleHelped: 140,
    eventsConducted: 7,
    fundsUtilized: 22000
  },
  {
    ngoId: 'NGO006',
    ngoName: 'Health Care Initiative',
    month: 'February',
    year: 2024,
    peopleHelped: 250,
    eventsConducted: 15,
    fundsUtilized: 50000
  },

  // March 2024 Reports
  {
    ngoId: 'NGO001',
    ngoName: 'Hope Foundation',
    month: 'March',
    year: 2024,
    peopleHelped: 160,
    eventsConducted: 5,
    fundsUtilized: 26000
  },
  {
    ngoId: 'NGO002',
    ngoName: 'Green Earth Society',
    month: 'March',
    year: 2024,
    peopleHelped: 190,
    eventsConducted: 7,
    fundsUtilized: 29000
  },
  {
    ngoId: 'NGO003',
    ngoName: 'Education for All',
    month: 'March',
    year: 2024,
    peopleHelped: 320,
    eventsConducted: 14,
    fundsUtilized: 48000
  },
  {
    ngoId: 'NGO005',
    ngoName: 'Child Care Foundation',
    month: 'March',
    year: 2024,
    peopleHelped: 200,
    eventsConducted: 5,
    fundsUtilized: 38000
  },
  {
    ngoId: 'NGO006',
    ngoName: 'Health Care Initiative',
    month: 'March',
    year: 2024,
    peopleHelped: 280,
    eventsConducted: 18,
    fundsUtilized: 55000
  },
  {
    ngoId: 'NGO007',
    ngoName: 'Rural Development Society',
    month: 'March',
    year: 2024,
    peopleHelped: 350,
    eventsConducted: 20,
    fundsUtilized: 60000
  },

  // April 2024 Reports
  {
    ngoId: 'NGO001',
    ngoName: 'Hope Foundation',
    month: 'April',
    year: 2024,
    peopleHelped: 180,
    eventsConducted: 6,
    fundsUtilized: 30000
  },
  {
    ngoId: 'NGO002',
    ngoName: 'Green Earth Society',
    month: 'April',
    year: 2024,
    peopleHelped: 240,
    eventsConducted: 10,
    fundsUtilized: 35000
  },
  {
    ngoId: 'NGO003',
    ngoName: 'Education for All',
    month: 'April',
    year: 2024,
    peopleHelped: 350,
    eventsConducted: 16,
    fundsUtilized: 52000
  },
  {
    ngoId: 'NGO004',
    ngoName: 'Women Empowerment Center',
    month: 'April',
    year: 2024,
    peopleHelped: 160,
    eventsConducted: 8,
    fundsUtilized: 25000
  },
  {
    ngoId: 'NGO005',
    ngoName: 'Child Care Foundation',
    month: 'April',
    year: 2024,
    peopleHelped: 220,
    eventsConducted: 6,
    fundsUtilized: 40000
  },
  {
    ngoId: 'NGO006',
    ngoName: 'Health Care Initiative',
    month: 'April',
    year: 2024,
    peopleHelped: 300,
    eventsConducted: 20,
    fundsUtilized: 58000
  },
  {
    ngoId: 'NGO007',
    ngoName: 'Rural Development Society',
    month: 'April',
    year: 2024,
    peopleHelped: 400,
    eventsConducted: 25,
    fundsUtilized: 70000
  },
  {
    ngoId: 'NGO008',
    ngoName: 'Disability Support Group',
    month: 'April',
    year: 2024,
    peopleHelped: 120,
    eventsConducted: 4,
    fundsUtilized: 18000
  }
];

/**
 * Helper function to get monthly summary data
 * Calculates totals for a specific month and year
 */
export const getMonthlySummary = (month, year) => {
  const monthReports = dummyReports.filter(
    report => report.month === month && report.year === year
  );

  const totalPeopleHelped = monthReports.reduce((sum, report) => sum + report.peopleHelped, 0);
  const totalEventsConducted = monthReports.reduce((sum, report) => sum + report.eventsConducted, 0);
  const totalFundsUtilized = monthReports.reduce((sum, report) => sum + report.fundsUtilized, 0);

  return {
    month,
    year,
    totalNGOsReporting: monthReports.length,
    totalPeopleHelped,
    totalEventsConducted,
    totalFundsUtilized,
    ngoReports: monthReports
  };
};

/**
 * Get list of available months and years from the dummy data
 */
export const getAvailableMonths = () => {
  const uniqueMonths = new Set();
  
  dummyReports.forEach(report => {
    uniqueMonths.add(`${report.month}-${report.year}`);
  });

  return Array.from(uniqueMonths).map(monthYear => {
    const [month, year] = monthYear.split('-');
    return { month, year: parseInt(year) };
  });
};
