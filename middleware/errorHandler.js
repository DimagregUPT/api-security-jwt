/**
 * Error handling middleware for the application
 */
class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends BaseError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends BaseError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

/**
 * Not found middleware - creates a 404 error for unmatched routes
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new NotFoundError(`Not Found - ${req.originalUrl} does not exist`);
  next(error);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle JWT-specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Invalid token',
      details: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expired',
      details: 'Your session has expired. Please login again.'
    });
  }

  // Handle custom error types
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...(isDevelopment && { stack: err.stack }) // Include stack trace in development mode
    });
  }

  // Handle other server errors
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong on the server',
    ...(isDevelopment && { stack: err.stack }) // Include stack trace in development mode
  });
};

module.exports = {
  BaseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  errorHandler,
  notFoundMiddleware
};