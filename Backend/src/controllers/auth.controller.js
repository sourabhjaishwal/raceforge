const AuthService = require("../services/auth.service");

class AuthController {
  // POST /api/v1/auth/register
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password required",
        });
      }

      // Call service
      const { user } = await AuthService.register(email, password);

      // Return response
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      // Pass errors to error handler middleware
      next(error);
    }
  }

  // POST /api/v1/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password required",
        });
      }

      // Call service
      const { user, token } = await AuthService.login(email, password);

      // Return response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      // Pass errors to error handler
      next(error);
    }
  }
}

module.exports = new AuthController();
