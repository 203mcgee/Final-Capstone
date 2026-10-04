
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

;
router.post('/:id/endorse', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // ATOMIC OPERATION: Add user ID to array ONLY if not already present
    const skill = await Skill.findOneAndUpdate(
      { 
        _id: id, 
        endorsedBy: { $ne: userId } // Query condition: user must NOT be in array
      },
      { 
        $addToSet: { endorsedBy: userId } // Atomic addition (prevents duplicates at DB level)
      },
      { new: true }
    );

    // If query failed to match, either skill doesn't exist OR user already endorsed
    if (!skill) {
      const existingSkill = await Skill.findById(id);
      if (!existingSkill) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }
      return res.status(400).json({ 
        success: false, 
        error: 'You have already endorsed this skill' 
      });
    }

    // Atomically recalculate endorsements count
    skill.endorsements = skill.endorsedBy.length;
    await skill.save();

    res.status(200).json({ success: true, data: skill });
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


export default router;
