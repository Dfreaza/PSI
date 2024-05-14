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
  TotalPassedTests: Number,
  TotalWarningTests: Number,
  TotalFailedTests: Number,
  TotalInapplicable: Number,
  //TestsResults: [String],
});

const DetailStatistics = mongoose.model('DetailStatistics', DetailStatisticsSchema);

module.exports = DetailStatistics;