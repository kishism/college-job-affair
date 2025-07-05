const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
