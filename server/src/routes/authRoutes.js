// // routes/authRoutes.js
// import express from 'express';
// import jwt from 'jsonwebtoken';

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// // Mock login route to generate admin and user tokens for testing
// router.post('/login', (req, res) => {
//   const { email } = req.body;

//   // Simple mock logic: if email contains "admin", issue an admin token
//   const isAdmin = email && email.includes('admin');

//   const payload = {
//     _id: 'USER-0001',
//     email: email || 'user@example.com',
//     role: isAdmin ? 'admin' : 'user'
//   };

//   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

//   res.status(200).json({
//     message: 'Login successful',
//     token,
//     user: payload
//   });
// });

// export default router;

//authRoutes
// routes/authRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Pass password into passwordHash; pre("save") hook will hash it before storing
    const newUser = new User({
      email: email.toLowerCase(),
      passwordHash: password,
      role: "user" // Default user role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

export default router;