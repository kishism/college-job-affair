const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // optional: attach user info to request
    next();
  } catch (err) {
    return res.redirect('/admin/login');
  }
}

module.exports = { requireAuth };
