// src/middleware/validate.js

/**
 * Generic Express middleware to validate req.body against a Zod schema.
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 */
export const validate = (schema) => (req, res, next) => {
  // safeParse returns { success: true, data } or { success: false, error }
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format error messages into standard API response format
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return res.status(400).json({
      message: 'Validation Error',
      errors: formattedErrors
    });
  }

  // Replace req.body with the sanitized/stripped Zod parsed data
  req.body = result.data;
  next();
};