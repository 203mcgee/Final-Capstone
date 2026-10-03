// src/middleware/validate.js AI
import { z } from 'zod';

// Schema enforcing strict types and allowed enum values for Skills
export const skillSchema = z.object({
  name: z.string({ required_error: 'Skill name is required' }).min(1, 'Name cannot be empty').trim(),
  category: z.enum(['frontend', 'backend', 'database', 'tools', 'design'], {
    errorMap: () => ({ message: 'Category must be one of: frontend, backend, database, tools, design' })
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Level must be one of: beginner, intermediate, advanced' })
  }),
  yearsExperience: z.number({ required_error: 'Years of experience is required' }).min(0, 'Experience must be >= 0')
}).strip(); // Strips unknown fields automatically

// Schema for PATCH updates (all fields optional)
export const updateSkillSchema = skillSchema.partial();

// Generic Zod Validation Middleware
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }

  // Replace body with sanitized/stripped data
  req.body = result.data;
  next();
};