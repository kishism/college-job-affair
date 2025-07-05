// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const AdminUser = require('./models/AdminUser');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashed = await bcrypt.hash('admin123', 10);
    await AdminUser.create({ username: 'admin', password: hashed });
    console.log('Admin user created!');
    mongoose.disconnect();
  });
