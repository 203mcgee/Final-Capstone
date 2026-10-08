import mongoose from 'mongoose';
import { z } from 'zod';

const CATEGORIES = ['frontend', 'backend', 'database', 'tools', 'design'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

// Create schema: unknown fields (endorsements, endorsedBy, _id) are stripped by default
export const skillZodSchema = z.object({
  name: z
    .string({ error: 'This skill needs to have a name' })
    .trim()
    .min(1, 'Name cannot be empty'),
  category: z.enum(CATEGORIES, {
    error: `Category must be one of: ${CATEGORIES.join(', ')}`,
  }),
  level: z.enum(LEVELS, {
    error: `Level must be one of: ${LEVELS.join(', ')}`,
  }),
  yearsExperience: z
    .number({ error: 'Years of experience is required' })
    .min(0, 'Years of experience must be at least 0'),
});

// PATCH: every field optional
export const updateSkillZodSchema = skillZodSchema.partial();

const skillSchema = new mongoose.Schema({
  _id: { type: String, trim: true },
  name: {
    type: String,
    required: [true, 'This skill needs to have a name'],
    unique: true,
    trim: true,
  },
  category: { type: String, enum: CATEGORIES, trim: true },
  level: { type: String, enum: LEVELS, trim: true },
  yearsExperience: { type: Number, min: 0 },
  endorsements: { type: Number, min: 0, default: 0 },
  endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

skillSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.endorsedBy; // never sent to the client
    return ret;
  },
});

export default mongoose.model('Skill', skillSchema);