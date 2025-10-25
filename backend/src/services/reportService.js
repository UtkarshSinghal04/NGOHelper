/**
 * Report service for handling NGO reports
 */

const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

const db = getDatabase();

/**
 * Submit a single report
 * If a report with the same NGO ID, month, and year already exists, it will be overwritten
 */
const submitReport = async (reportData) => {
  return new Promise((resolve, reject) => {
    const reportId = uuidv4();
    const currentDate = new Date().toISOString();
    const year = reportData.year || new Date().getFullYear();

    // For now, we'll use a default NGO name. In a real app, you'd look this up
    const ngoName = `NGO ${reportData.ngoId}`;

    // First, check if a report already exists for this NGO, month, and year
    db.get(
      'SELECT id FROM reports WHERE ngo_id = ? AND month = ? AND year = ?',
      [reportData.ngoId, reportData.month, year],
      (err, existingReport) => {
        if (err) {
          reject(err);
          return;
        }

        const finalReportId = existingReport ? existingReport.id : reportId;
        const finalCreatedAt = existingReport ? 
          // Keep original creation date if updating
          new Date().toISOString() : 
          currentDate;

        // Use INSERT OR REPLACE to handle both new and existing reports
        db.run(
          `INSERT OR REPLACE INTO reports (id, ngo_id, ngo_name, month, year, people_helped, events_conducted, funds_utilized, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            finalReportId,
            reportData.ngoId,
            ngoName,
            reportData.month,
            year,
            reportData.peopleHelped,
            reportData.eventsConducted,
            reportData.fundsUtilized,
            finalCreatedAt,
            currentDate
          ],
          function(err) {
            if (err) {
              reject(err);
              return;
            }

            // Return the created/updated report
            const report = {
              id: finalReportId,
              ngoId: reportData.ngoId,
              ngoName,
              month: reportData.month,
              year,
              peopleHelped: reportData.peopleHelped,
              eventsConducted: reportData.eventsConducted,
              fundsUtilized: reportData.fundsUtilized,
              createdAt: finalCreatedAt,
              updatedAt: currentDate
            };

            resolve(report);
          }
        );
      }
    );
  });
};

/**
 * Get monthly summary data
 */
const getMonthlySummary = async (month, year) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM reports WHERE month = ? AND year = ?',
      [month, year],
      (err, reports) => {
        if (err) {
          reject(err);
          return;
        }

        const totalPeopleHelped = reports.reduce((sum, report) => sum + report.people_helped, 0);
        const totalEventsConducted = reports.reduce((sum, report) => sum + report.events_conducted, 0);
        const totalFundsUtilized = reports.reduce((sum, report) => sum + report.funds_utilized, 0);

        const summary = {
          month,
          year,
          totalNGOsReporting: reports.length,
          totalPeopleHelped,
          totalEventsConducted,
          totalFundsUtilized,
          ngoReports: reports.map(report => ({
            ngoId: report.ngo_id,
            ngoName: report.ngo_name,
            peopleHelped: report.people_helped,
            eventsConducted: report.events_conducted,
            fundsUtilized: report.funds_utilized
          }))
        };

        resolve(summary);
      }
    );
  });
};

/**
 * Get all reports for a specific month and year
 */
const getReportsByMonth = async (month, year) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM reports WHERE month = ? AND year = ? ORDER BY created_at DESC',
      [month, year],
      (err, reports) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(reports);
      }
    );
  });
};

/**
 * Get all reports
 */
const getAllReports = async () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM reports ORDER BY created_at DESC',
      (err, reports) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(reports);
      }
    );
  });
};

module.exports = {
  submitReport,
  getMonthlySummary,
  getReportsByMonth,
  getAllReports
};
