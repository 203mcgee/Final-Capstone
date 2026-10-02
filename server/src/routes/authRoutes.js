// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Mock login route to generate admin and user tokens for testing
router.post('/login', (req, res) => {
  const { email } = req.body;

  // Simple mock logic: if email contains "admin", issue an admin token
  const isAdmin = email && email.includes('admin');

  const payload = {
    _id: 'USER-0001',
    email: email || 'user@example.com',
    role: isAdmin ? 'admin' : 'user'
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: payload
  });
});

export default router;