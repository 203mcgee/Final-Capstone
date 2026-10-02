// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// export const requireAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // Attaches user payload (_id, role, etc.)
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };

// export const requireAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ message: 'Forbidden: Admin access required.' });
// };




// // // middleware/auth.js
// // export const requireAuth = (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
// //   }
// //   // JWT verification logic populates req.user
// //   next();
// // };

// // export const requireAdmin = (req, res, next) => {
// //   if (req.user && req.user.role === 'admin') {
// //     return next();
// //   }
// //   return res.status(403).json({ message: 'Forbidden: Admin access required.' });
// // };


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Check JWT, load user from DB, and verify status + tokenVersion
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Token expired or invalid' });
    }

    // Load full user state from database
    const user = await User.findById(decoded.userId);

    // Verify account exists, is active, and tokenVersion matches
    if (!user || !user.isActive || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token or account inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Protect routes by specific roles (e.g. requireRole('admin'))
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  };
};