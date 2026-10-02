import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import Skill from './models/Skill.js';
import authRouter from './routes/authRoutes.js';
import skillRouter from './routes/skillRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');
// } catch (err) {
//     console.error('Could not connect to MongoDB:', err.message);
//     process.exit(1);
// }

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Middleware check for Admin/Auth role
// export const requireAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
//   }
//   // Verify token logic here...
//   next();
// };

// export const requireAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ message: 'Forbidden: Admin access required' });
// };

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('The Skill server is running!');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});



// Auth endpoints
app.use('/api/auth', authRouter);

// Skill endpoints
app.use('/api/skills', skillRouter);


// // For now this is to help with the search
// app.get('/api/skills', async (req, res, next) => {

//     try {
//         const { category, name, level, years } = req.query;
//         const filter = {};

//         if (category) {
//             const getCategory = category.trim();
//             filter.category = { $regex: getCategory, $options: 'i' };
//         }

//         if (name) {
//             filter.name = name.trim().toLowerCase();
//         }

//         if (level) {
//             filter.level = level.trim().toLowerCase();
//         }

//         if (years) {
//             filter.level = level.trim().toLowerCase();
//         }



//         const skills = await Skill.find(filter);
//         res.status(200).json({ success: true, count: skills.length, data: skills });



//     } catch (err) {
//         next(err);
//     }


// });

// app.get('/api/skills/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;

        

//         const skill = await Skill.findById(id);

//         if (!skill) {
//             return res.status(404).json({ success: false, error: `Skill with ID ${id} not found.` });
//         }

//         res.status(200).json({ success: true, data: skill });
//     } catch (err) {
//         next(err);
//     }

// });

// // POST /api/skills/:id/endorse - Logged-in users
// app.post('/api/skills/:id/endorse', requireAuth, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id; // Extracted from JWT middleware

//     // Check if skill exists first
//     const skill = await Skill.findById(id);
//     if (!skill) {
//       return res.status(404).json({ message: `Skill with ID '${id}' not found.` });
//     }

//     // Check if user has already endorsed this skill
//     const alreadyEndorsed = skill.endorsedBy.some(
//       (e) => e.toString() === userId.toString()
//     );

//     if (alreadyEndorsed) {
//       return res.status(400).json({ message: 'You have already endorsed this skill.' });
//     }

//     // Atomic update: add user to array and increment counter
//     const updatedSkill = await Skill.findByIdAndUpdate(
//       id,
//       {
//         $addToSet: { endorsedBy: userId },$inc: { endorsements: 1 }
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedSkill);
//   } catch (err) {
//     next(err);
//   }
// });



// // POST /api/skills - Create a new skill (Admin only)
// app.post('/api/skills', requireAuth, requireAdmin, async (req, res, next) => {
//   try {
//     const { id, name, category, level, yearsExperience } = req.body;

//     // Check if ID or name already exists
//     const existingSkill = await Skill.findOne({
//       $or: [{ _id: id }, { name: name?.trim() }]
//     });

//     if (existingSkill) {
//       return res.status(400).json({ message: 'A skill with this ID or name already exists.' });
//     }

//     const newSkill = new Skill({
//       _id: id,
//       name,
//       category,
//       level,
//       yearsExperience
//     });

//     await newSkill.save();
//     res.status(201).json(newSkill);
//   } catch (err) {
//     next(err);
//   }
// });

// // PATCH /api/skills/:id - Update an existing skill (Admin only)
// app.patch('/api/skills/:id', requireAuth, requireAdmin, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const allowedUpdates = ['name', 'category', 'level', 'yearsExperience'];
//     const updates = {};

//     Object.keys(req.body).forEach((key) => {
//       if (allowedUpdates.includes(key)) {
//         updates[key] = req.body[key];
//       }
//     });

//     const updatedSkill = await Skill.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     if (!updatedSkill) {
//       return res.status(404).json({ message: `Skill with ID '${id}' not found.` });
//     }

//     res.status(200).json(updatedSkill);
//   } catch (err) {
//     next(err);
//   }
// });

// // DELETE /api/skills/:id - Delete a skill (Admin only)
// app.delete('/api/skills/:id', requireAuth, requireAdmin, async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const deletedSkill = await Skill.findByIdAndDelete(id);

//     if (!deletedSkill) {
//       return res.status(404).json({ message: `Skill with ID '${id}' not found.` });
//     }

//     res.status(200).json({ message: 'Skill successfully deleted.' });
//   } catch (err) {
//     next(err);
//   }
// });


// This is the error handler 
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});