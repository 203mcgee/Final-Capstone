// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRequest } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../models/authSchema.js';

const router = express.Router();

// Middleware to verify JWT token from header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <TOKEN>"

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_jwt_key_here", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
};

// GET /api/auth/me - Retrieve current logged-in user details
router.get("/me", authenticateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select("-passwordHash");

        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or inactive" });
        }

        res.status(200).json({
            id: user._id,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        next(err);
    }
});




router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // 🔐 Hash password with bcrypt in /register
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role: 'user',
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, tokenVersion: newUser.tokenVersion },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      token,
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔐 Verify password with bcrypt in /login
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;