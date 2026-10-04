// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    const isValidPassword = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, "$2b$12$invalidhashpaddingtoequalizetiming");

    if (!user || !isValidPassword || !user.isActive) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔑 MAKE SURE role: user.role IS HERE
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role, // 👈 CRITICAL: Must be explicitly included
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_SECRET || "your_super_secret_jwt_key_here",
      { expiresIn: "1h" }
    );

    // Return the role in response body so you can see it in Postman immediately
    res.status(200).json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;