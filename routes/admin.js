const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const JWT_SECRET = process.env.JWT_SECRET;

// Show login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Handle login form
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await AdminUser.findOne({ username });
  if (!user) {
    return res.render('login', { error: 'Invalid username' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', { error: 'Incorrect password' });
  }

  // Logged in! For now just redirect (no full auth system yet)
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token); // if you use cookie-parser later
  res.redirect('/admin/dashboard');
});

module.exports = router;
