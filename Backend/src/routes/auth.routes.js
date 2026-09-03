const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerificationEmail);

// Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      userId: req.user.userId,
      role: req.user.role,
    },
  });
});

module.exports = router;
