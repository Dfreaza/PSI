// reportService.js

const Report = require('../models/report'); // Import the Report model

exports.saveReportToDatabase = async function (report) {
    const newReport = new Report({ content: report });
    const savedReport = await newReport.save();
    return savedReport._id;
}