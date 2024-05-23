const mongoose = require('mongoose');

const QualwebInfoSchema = new mongoose.Schema({
    name: String,
    code: String,
    description: String,
    outcome: String,
    successCriteria: [String],
});

const QualwebInfo = mongoose.model('QualwebInfo', QualwebInfoSchema);

module.exports = QualwebInfo;