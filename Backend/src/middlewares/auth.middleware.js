const AuthService = require("../services/auth.service");

// Middleware to verify JWT and attach user to request
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.slice(7);

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Attach decoded user information to request
    req.user = decoded;

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
