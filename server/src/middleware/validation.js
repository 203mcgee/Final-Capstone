// src/middleware/validation.js





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

