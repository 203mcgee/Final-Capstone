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
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

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