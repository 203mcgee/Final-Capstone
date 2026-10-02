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


