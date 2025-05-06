/**
 * Error handling middleware for the application
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Bad Request Error (400)
class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', details = null) {
    super(400, message, details);
  }
}

// Unauthorized Error (401)
class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details = null) {
    super(401, message, details);
  }
}

// Forbidden Error (403)
class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', details = null) {
    super(403, message, details);
  }
}

// Not Found Error (404)
class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details = null) {
    super(404, message, details);
  }
}

// Internal Server Error (500)
class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', details = null) {
    super(500, message, details);
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
  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal Server Error';
  let errorDetails = err.details || '';

  console.error(`[ERROR] ${statusCode} - ${errorMessage}`);
  console.error('Error details:', err);
  
  // If in development mode, include stack trace
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: errorMessage,
      details: errorDetails,
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  errorHandler,
  notFoundMiddleware
};