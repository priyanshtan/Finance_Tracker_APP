const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  // console.log('Authorization Header:', req.headers.authorization);


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    // console.log('Decoded:', decoded);

    next();
    
  } catch (err) {
  console.error('JWT Verification Error:', err.message);
  res.status(403).json({ message: 'Invalid token' });
}
}

module.exports = auth;
