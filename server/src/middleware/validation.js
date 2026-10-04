// src/middleware/validate.js

import { success } from "zod";


export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Safely extract issues from Zod
    const issues = result.error?.issues || result.error?.errors || [];

    const formattedErrors = issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success:false,
      message: 'Validation Error',
      errors: formattedErrors
    });
  }

  req.body = result.data;
  next();
};