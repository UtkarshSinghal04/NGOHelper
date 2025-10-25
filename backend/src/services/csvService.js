/**
 * CSV processing service
 */

const csv = require('csv-parser');
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../config/database');

const db = getDatabase();

/**
 * Validate a single CSV row
 */
const validateCSVRow = (row, rowNumber) => {
  const errors = [];
  
  // Extract and validate NGO ID
  const ngoId = row['NGO ID'] || row['ngoId'] || row['NGO_ID'];
  if (!ngoId || ngoId.trim() === '') {
    errors.push('NGO ID is required');
  }

  // Extract and validate Month
  const month = row['Month'] || row['month'];
  const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
  if (!month || month.trim() === '') {
    errors.push('Month is required');
  } else if (!validMonths.includes(month.trim())) {
    errors.push(`Invalid month: "${month}". Must be one of: ${validMonths.join(', ')}`);
  }

  // Extract and validate Year
  const yearStr = row['Year'] || row['year'] || row['YEAR'];
  const currentYear = new Date().getFullYear();
  const year = parseInt(yearStr);
  if (!yearStr || yearStr.trim() === '') {
    errors.push('Year is required');
  } else if (isNaN(year)) {
    errors.push(`Invalid year: "${yearStr}". Must be a valid number`);
  } else if (year < 2020 || year > currentYear) {
    errors.push(`Invalid year: ${year}. Must be between 2020 and ${currentYear}`);
  }

  // Extract and validate People Helped
  const peopleHelpedStr = row['People Helped'] || row['peopleHelped'] || row['PEOPLE_HELPED'];
  const peopleHelped = parseInt(peopleHelpedStr);
  if (!peopleHelpedStr || peopleHelpedStr.trim() === '') {
    errors.push('People Helped is required');
  } else if (isNaN(peopleHelped)) {
    errors.push(`Invalid People Helped: "${peopleHelpedStr}". Must be a valid number`);
  } else if (peopleHelped <= 0) {
    errors.push(`People Helped must be greater than 0, got: ${peopleHelped}`);
  }

  // Extract and validate Events Conducted
  const eventsConductedStr = row['Events Conducted'] || row['eventsConducted'] || row['EVENTS_CONDUCTED'];
  const eventsConducted = parseInt(eventsConductedStr);
  if (!eventsConductedStr || eventsConductedStr.trim() === '') {
    errors.push('Events Conducted is required');
  } else if (isNaN(eventsConducted)) {
    errors.push(`Invalid Events Conducted: "${eventsConductedStr}". Must be a valid number`);
  } else if (eventsConducted <= 0) {
    errors.push(`Events Conducted must be greater than 0, got: ${eventsConducted}`);
  }

  // Extract and validate Funds Utilized
  const fundsUtilizedStr = row['Funds Utilized'] || row['fundsUtilized'] || row['FUNDS_UTILIZED'];
  const fundsUtilized = parseFloat(fundsUtilizedStr);
  if (!fundsUtilizedStr || fundsUtilizedStr.trim() === '') {
    errors.push('Funds Utilized is required');
  } else if (isNaN(fundsUtilized)) {
    errors.push(`Invalid Funds Utilized: "${fundsUtilizedStr}". Must be a valid number`);
  } else if (fundsUtilized <= 0) {
    errors.push(`Funds Utilized must be greater than 0, got: ${fundsUtilized}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      ngoId: ngoId.trim(),
      month: month.trim(),
      year,
      peopleHelped,
      eventsConducted,
      fundsUtilized
    } : null
  };
};

/**
 * Process CSV file and save reports to database
 */
const processCSVFile = async (csvBuffer, jobId) => {
  return new Promise(async (resolve, reject) => {
    const validRows = [];
    const invalidRows = [];
    let totalRows = 0;
    let processedRows = 0;
    let successfulRows = 0;

    // Import updateJobStatus here to avoid circular dependency
    const { updateJobStatus, updateJobWithValidationResults } = require('./jobService');

    // Create readable stream from buffer
    const stream = Readable.from(csvBuffer.toString());

    stream
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (row) => {
        totalRows++;
        const rowNumber = totalRows + 1; // +1 because CSV has header row
        
        const validation = validateCSVRow(row, rowNumber);
        
        if (validation.isValid) {
          validRows.push(validation.data);
        } else {
          invalidRows.push({
            rowNumber,
            errors: validation.errors,
            data: row
          });
        }
      })
      .on('end', async () => {
        try {
          // Update job with total rows
          await updateJobStatus(jobId, 'processing', 0, totalRows, 0);

          // Process only valid rows
          for (const reportData of validRows) {
            try {
              await saveReportFromCSV(reportData);
              successfulRows++;
              processedRows++;
              
              // Update progress
              const progress = Math.round((processedRows / totalRows) * 100);
              await updateJobStatus(jobId, 'processing', progress, totalRows, processedRows);
            } catch (error) {
              console.error('Error saving report:', error);
              // Continue processing other reports
            }
          }

          // Determine final status
          const finalStatus = invalidRows.length === 0 ? 'completed' : 'completed_with_errors';
          const errorMessage = invalidRows.length > 0 ? 
            `Processed ${successfulRows} valid rows. ${invalidRows.length} rows had validation errors.` : 
            `Successfully processed all ${successfulRows} rows.`;

          // Update job with detailed results
          await updateJobWithValidationResults(jobId, finalStatus, 100, totalRows, processedRows, {
            totalRows,
            validRows: validRows.length,
            invalidRows: invalidRows.length,
            successfulRows,
            errors: invalidRows
          });

          resolve();
        } catch (error) {
          // Mark job as failed
          await updateJobStatus(jobId, 'failed', 0, totalRows, processedRows, error.message);
          reject(error);
        }
      })
      .on('error', async (error) => {
        // Mark job as failed
        await updateJobStatus(jobId, 'failed', 0, totalRows, processedRows, error.message);
        reject(error);
      });
  });
};

/**
 * Save individual report from CSV
 * If a report with the same NGO ID, month, and year already exists, it will be overwritten
 */
const saveReportFromCSV = async (reportData) => {
  return new Promise((resolve, reject) => {
    const reportId = uuidv4();
    const currentDate = new Date().toISOString();
    const year = reportData.year || new Date().getFullYear();
    const ngoName = `NGO ${reportData.ngoId}`;

    // First, check if a report already exists for this NGO, month, and year
    db.get(
      'SELECT id, created_at FROM reports WHERE ngo_id = ? AND month = ? AND year = ?',
      [reportData.ngoId, reportData.month, year],
      (err, existingReport) => {
        if (err) {
          reject(err);
          return;
        }

        const finalReportId = existingReport ? existingReport.id : reportId;
        const finalCreatedAt = existingReport ? existingReport.created_at : currentDate;

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
            resolve();
          }
        );
      }
    );
  });
};

module.exports = {
  processCSVFile
};
