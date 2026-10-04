import { z } from 'zod';

// Schema for POST /api/auth/register
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .trim()
    .min(1, 'Email cannot be empty'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
  role: z
    .enum(['admin', 'user'], {
      errorMap: () => ({ message: 'Role must be either admin or user' })
    })
    .optional()
    .default('user')
}).strip(); // Automatically strip unexpected body fields

// Schema for POST /api/auth/login
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
}).strip();