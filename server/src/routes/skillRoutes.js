// import express from 'express';
// import Skill from '../models/Skill.js';
// import { requireAuth, requireAdmin } from '../middleware/auth.js';

// const router = express.Router()


// router.get('/', (req, res) => {
//     res.send('The Skill server is running!');
// });

// router.get('/health', (req, res) => {
//     res.json({ status: 'ok' });
// });

// // For now this is to help with the search
// router.get('/', async (req, res, next) => {

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

// router.get('/:id', async (req, res, next) => {
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
// router.post('/:id/endorse', requireAuth, async (req, res, next) => {
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

// // router.post('/', /* requireAuth, requireAdmin, */ async (req, res, next) => {
// //   try {
// //     const newSkill = new Skill(req.body);
// //     await newSkill.save();
// //     res.status(201).json(newSkill);
// //   } catch (err) {
// //     next(err);
// //   }
// // });



// // POST /api/skills - Create a new skill (Admin only)
// router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
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
// router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
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
// router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
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

// export default router;

import express from 'express';
import Skill from '../models/Skill.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { skillZodSchema,updateSkillZodSchema } from '../models/Skill.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/skills - Search & Filter Skills
router.get('/', async (req, res, next) => {
  try {
    const { category, name, level, years } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $regex: category.trim(),$options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name.trim(),$options: 'i' };
    }

    if (level) {
      filter.level = level.trim().toLowerCase();
    }

    if (years) {
      filter.yearsExperience = Number(years);
    }

    const skills = await Skill.find(filter);
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (err) {
    next(err);
  }
});

// GET /api/skills/:id - Get Single Skill
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found.` });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
});



// POST /api/skills - Create Skill (Admin Only)
router.post('/', requireAuth, requireAdmin, validate(skillZodSchema),async (req, res, next) => {
    console.log('Body:', req.body);
    console.log('requireAuth:', typeof requireAuth);
    console.log('requireAdmin:', typeof requireAdmin);
    console.log('validate function:', typeof validate);
    console.log('validate execution:', typeof validate(skillZodSchema));
    
  try {
    const skillData = { ...req.body };

    // Generate a custom _id from the name if one wasn't provided
    if (!skillData._id && skillData.name) {
      skillData._id = skillData.name.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const newSkill = new Skill(skillData);
    const savedSkill = await newSkill.save();
    res.status(201).json({ success: true, data: savedSkill });
  } catch (err) {
    console.error('Create skill failed:', err.message);

    // Duplicate _id or name
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'A skill with that name or ID already exists.' });
    }

    next(err);
  }
});

// routes/skillRoutes.js

// Make sure the path matches POST /:id/endorse
router.post('/:id/endorse', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user already endorsed
    if (skill.endorsedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already endorsed this skill' });
    }

    skill.endorsedBy.push(userId);
    skill.endorsements = skill.endorsedBy.length;
    await skill.save();

    res.status(200).json(skill);
  } catch (err) {
    next(err);
  }
});


// PATCH /api/skills/:id - Update Skill (Admin Only)
router.patch('/:id', requireAuth, requireAdmin,validate(updateSkillZodSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSkill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedSkill) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found.` });
    }

    res.status(200).json({ success: true, data: updatedSkill });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/skills/:id - Delete Skill (Admin Only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found.` });
    }

    res.status(200).json({ success: true, message: `Skill ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
});

// export default router;



// POST /api/skills - Create a New Skill (Admin Only)
// router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
//   try {
//     const { _id, name, category, level, yearsExperience } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, error: 'Skill name is required.' });
//     }

//     // Build unique duplicate check without undefined _id issues
//     const duplicateQuery = [{ name: name.trim() }];
//     if (_id) {
//       duplicateQuery.push({ _id: _id });
//     }

//     const existingSkill = await Skill.findOne({ $or: duplicateQuery });

//     if (existingSkill) {
//       return res.status(400).json({ success: false, error: 'A skill with this ID or name already exists.' });
//     }

//     const skillData = {
//       name: name.trim(),
//       category,
//       level,
//       yearsExperience
//     };

//     // Only assign explicit _id if supplied
//     if (id) {
//       skillData._id = id;
//     }

//     const newSkill = new Skill(skillData);
//     await newSkill.save();

//     res.status(201).json({ success: true, data: newSkill });
//   } catch (err) {
//     next(err);
//   }
// });

// // PATCH /api/skills/:id - Update Skill (Admin Only)
// router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
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
//       return res.status(404).json({ success: false, error: `Skill with ID '${id}' not found.` });
//     }

//     res.status(200).json({ success: true, data: updatedSkill });
//   } catch (err) {
//     next(err);
//   }
// });

// // DELETE /api/skills/:id - Delete Skill (Admin Only)
// router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deletedSkill = await Skill.findByIdAndDelete(id);

//     if (!deletedSkill) {
//       return res.status(404).json({ success: false, error: `Skill with ID '${id}' not found.` });
//     }

//     res.status(200).json({ success: true, message: 'Skill successfully deleted.' });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
