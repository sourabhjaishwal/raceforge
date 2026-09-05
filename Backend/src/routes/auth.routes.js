/**
 * @name Authentication Routes
 * @description Defines public, protected, and administrative authentication endpoints
 */

const express = require("express");

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// PUBLIC ROUTES

/**
 * @name Register User
 * @description Register a new user account
 * @endpoint POST /api/v1/auth/register
 */
router.post("/register", AuthController.register);

/**
 * @name Login User
 * @description Authenticate a verified user and return a JWT
 * @endpoint POST /api/v1/auth/login
 */
router.post("/login", AuthController.login);

/**
 * @name Verify Email
 * @description Verify a user's email address using a verification token
 * @endpoint POST /api/v1/auth/verify-email
 */
router.post("/verify-email", AuthController.verifyEmail);

/**
 * @name Resend Verification Email
 * @description Send a new email verification token to an unverified user
 * @endpoint POST /api/v1/auth/resend-verification
 */
router.post("/resend-verification", AuthController.resendVerificationEmail);

// ADMIN ROUTES

/**
 * @name Promote User to Admin
 * @description Allow an authenticated admin to promote an existing user
 * @endpoint POST /api/v1/auth/admin/promote
 * @authentication Bearer JWT with admin role
 */
router.post(
  "/admin/promote",
  authMiddleware,
  adminMiddleware,
  AuthController.promoteUser,
);

// PROTECTED ROUTES

/**
 * @name Get Current User
 * @description Return the authenticated user's ID and role
 * @endpoint GET /api/v1/auth/me
 * @authentication Bearer JWT
 */
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
