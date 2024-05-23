const mongoose = require('mongoose');

const DetailStatisticsSchema = new mongoose.Schema({
    idWebsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website',
      required: true
  },
  idPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      required: true
  },
  totalPassedTests: Number,
  totalWarningTests: Number,
  totalFailedTests: Number,
  totalInapplicableTests: Number,
  actRulesTestsResults: [qualwebInfoSchema],
  wcagTestsResults: [qualwebInfoSchema],
});

const DetailStatistics = mongoose.model('DetailStatistics', DetailStatisticsSchema);

module.exports = DetailStatistics;