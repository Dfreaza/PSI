const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  select: Boolean,
  id: Number,
  url: String,
  appraisalDate: {type: Date, default: Date.now},
  conformity: { type: String, default: 'nao conforme' },
});

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;