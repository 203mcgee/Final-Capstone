// middleware/auth.js
import jwt from 'jsonwebtoken';


export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied. Admin required.' });
  }
  next();
};

// middleware/auth.js or middleware/admin.js

export function requireAdmin(req, res, next) {
    console.log('requireAdmin sees:', req.user);
  // Check if role is an array and contains 'admin', or if it's a string equal to 'admin'
  const roles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

  if (!roles.includes('admin')) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  next();
}

