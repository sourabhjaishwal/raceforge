const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Use custom status code when provided
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    message = "Email already registered";
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
