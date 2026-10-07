// src/middleware/validation.js
import { z } from 'zod';


// export const validate = (schema) => (req, res, next) => {
//   const result = schema.safeParse(req.body);

//   if (!result.success) {
//     // Safely extract issues from Zod
//     const issues = result.error?.issues || result.error?.errors || [];

//     const formattedErrors = issues.map((err) => ({
//       field: err.path.join('.'),
//       message: err.message,
//     }));

//     return res.status(400).json({
//       success:false,
//       message: 'Validation Error',
//       errors: formattedErrors
//     });
//   }

//   req.body = result.data;
//   next();
// };

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues ?? [];
    return res.status(400).json({
      message: issues[0]?.message || 'Validation error',
      errors: issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  req.body = result.data; // strips unknown fields
  next();
};

// export const validateRequest = (schema) => {
//   // MUST RETURN the inner middleware function taking (req, res, next)
//   return (req, res, next) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({ 
//         message: result.error.errors[0].message 
//       });
//     }
//     next();
//   };
// };


// export const registerSchema = z.object({
//   email: z
//     .string({ required_error: 'Email is required' })
//     .email('Invalid email address')
//     .trim(),
//   password: z
//     .string({ required_error: 'Password is required' })
//     .min(6, 'Password must be at least 6 characters long')
// }).strip();