
import express from 'express';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { skillZodSchema, updateSkillZodSchema } from '../models/Skill.js';
import authenticateToken from './authRoutes.js'
import { nextSkillId } from '../models/Counter.js';

const router = express.Router();

// Helper function to dynamically target MongoDB _id OR custom string IDs


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
      filter.category = { $regex: category.trim(), $options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name.trim(), $options: 'i' };
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
router.post('/', requireAuth, requireAdmin, validate(skillZodSchema), async (req, res, next) => {
  console.log('Body:', req.body);
  console.log('requireAuth:', typeof requireAuth);
  console.log('requireAdmin:', typeof requireAdmin);
  console.log('validate function:', typeof validate);
  console.log('validate execution:', typeof validate(skillZodSchema));

  try {
    if (await Skill.exists({ name: req.body.name })) {
      return res.status(409).json({ message: 'A skill with that name already exists.' });
    }
    const skillData = { ...req.body, _id: await nextSkillId() };

    const saved = await new Skill(skillData).save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Create skill failed:', err.message);

    // Duplicate _id or name
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'A skill with that name or ID already exists.' });
    }

    next(err);
  }
});

router.post('/:id/like', authenticateToken, async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const userId = req.user.id;
    const hasLiked = skill.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      return res.status(400).json({
        message: 'You have already liked this item.',
        alreadyLiked: true
      });
    }

    // Add user ID to likes array
    skill.likes.push(userId);
    await skill.save();

    res.json({
      message: 'Endorsement added successfully!',
      likeCount: skill.likes.length,
      hasLiked: true
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/endorse', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const skill = await Skill.findOneAndUpdate(
      { _id: id, endorsedBy: mongoose.trusted({ $ne: userId }) },
      { $inc: { endorsements: 1 }, $addToSet: { endorsedBy: userId } },
      { returnDocument: 'after' }
    );

    if (!skill) {
      const exists = await Skill.exists({ _id: id });
      if (!exists) return res.status(404).json({ message: 'Skill not found' });
      return res.status(409).json({ message: 'You have already endorsed this skill' });
    }

    return res.status(200).json(skill);
  } catch (err) {
    next(err);
  }
});




function getQueryForId(id) {
  // If id is a valid 24-character hex Mongo ObjectId, search _id
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }

  // Check all possible schema field names where 'SKL-0001' might be stored
  return {
    $or: [
      { id: id },
      { skillId: id },
      { skill_id: id },
      { code: id },
      { key: id },
      { customId: id }
    ]
  };
}


router.patch('/:id', requireAuth, requireAdmin, validate(updateSkillZodSchema), async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: `Skill with ID '${req.params.id}' not found.` });
    }
    return res.json(skill);
  } catch (err) {
    return next(err);
  }
});





// DELETE /api/skills/:id
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: `Skill with ID '${req.params.id}' not found.` });
    }

    return res.json({
      message: 'Skill deleted successfully.',
      deletedSkill: skill
    });
  } catch (err) {
    return next(err);
  }
});






// Express POST /api/skills route handler
export async function createSkillHandler(req, res, next) {
  try {
    // Generate custom _id or slug if applicable
    const customId = req.body.name.trim().toLowerCase();

    // Check if skill already exists
    const existingSkill = await Skill.findById(customId);
    if (existingSkill) {
      return res.status(409).json({
        message: `A skill with the name "${req.body.name}" already exists.`,
      });
    }

    const newSkill = await Skill.create({
      _id: customId,
      ...req.body,
    });

    return res.status(201).json(newSkill);
  } catch (err) {
    // Handle raw Mongoose E11000 duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'A skill with that name already exists in the database.',
      });
    }
    next(err);
  }
}


export default router;
