const mongoose = require('mongoose');

const JobFairSchema = new mongoose.Schema({
  title: String,
  date: Date,
  time: String,
  location: String,
  companies: [String],
  description: String,
});

module.exports = mongoose.model('JobFair', JobFairSchema);
