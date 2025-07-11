const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { requireAuth } = require('../middlewares/auth');

const JWT_SECRET = process.env.JWT_SECRET;

// GET: Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST: Handle login form submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await AdminUser.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect password' });
    }

    // Login successful – generate JWT and store in cookie
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true, // secure against XSS
      // secure: true, // uncomment in production with HTTPS
    });

    res.redirect('/admin/dashboard');

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});

// GET: Dashboard (Protected)
router.get('/dashboard', requireAuth, (req, res) => {
  res.send(`Welcome to the Admin Dashboard! User ID: ${req.user.id}`);
});

// GET: Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});

module.exports = router;
