const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  url: String,
  appraisalDate: {type: Date, default: Date.now},
  estadoPagina: { type: String, default: 'nao conforme' },
});

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;