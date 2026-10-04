// middleware/auth.js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_key'
    );
    
    // Attach decoded user info (including role) to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role // 👈 Must be present
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
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

