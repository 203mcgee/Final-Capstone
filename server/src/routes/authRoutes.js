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

import bcrypt from 'bcrypt';
import User from '../models/User.js';
import express from 'express';

const router = express();

router.post("/register", async (req,res) => {
    try{
        let existingUser = await User.findOne({email: req.body.email});

        if (existingUser){
            return res.status(400).send("Email already exists");
        }

        existingUser = await User.findOne({username: req.body.username});

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            roles:["user","admin"]
        });

        await newUser.save();
        res.status(201).send("User registered successfully");



    } catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

})

export default router;