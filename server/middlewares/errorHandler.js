const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle unauthorized errors passed by protect middleware
  if (
    err.name === "UnauthorizedError" ||
    err.message?.includes("Not authorized")
  ) {
    return res.status(401).json({
      success: false,
      error: err.message || "Unauthorized",
    });
  }

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  //Avoid leaking stack trace in production
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;