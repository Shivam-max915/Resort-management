import { AppError } from '../utils/errorHandler.js';

// Validate request body
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    req.validatedBody = value;
    next();
  };
};

// Validate query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    req.validatedQuery = value;
    next();
  };
};

// Validate URL parameters
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    req.validatedParams = value;
    next();
  };
};
