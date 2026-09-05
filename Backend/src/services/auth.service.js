/**
@name Auth Service
@description Handles registration, login, email verification, JWT generation, and authentication operations
*/

const crypto = require("crypto");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const EmailService = require("./email.service");

class AuthService {
  /**
   * @name Generate Token
   * @description Generate a JWT containing the user's ID and role
   */
  generateToken(userId, role) {
    const payload = {
      userId,
      role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  }

  /**
   * @name Register User
   * @description Create a new user account and send an email verification link
   */
  async register(email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 24 hours
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await User.create({
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: tokenExpiry,
    });

    // Send verification email.
    // Registration itself succeeds even if email delivery fails.
    try {
      await EmailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error("Verification email failed:", error.message);
    }

    // Registration does NOT return a JWT.
    // User must verify email before login.
    return {
      user: user.toJSON(),
      message: "Registration successful. Check your email to verify.",
    };
  }

  /**
   * @name Login User
   * @description Authenticate a verified user and generate a JWT
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isEmailVerified) {
      const error = new Error("Please verify your email first");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id.toString(), user.role);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * @name Verify Email
   * @description Verify a user's email using a valid, unexpired verification token
   */
  async verifyEmail(verificationToken) {
    const user = await User.findOne({
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: {
        $gt: new Date(),
      },
    });
    if (!user) {
      const error = new Error("Invalid or expired verification token");
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;

    await user.save();

    // Bootstrap the first admin after successful email verification.
    await this.bootstrapFirstAdmin(user);

    return {
      message: "Email verified successfully. You can now login.",
      user: user.toJSON(),
    };
  }

  /**
   * @name Resend Verification Email
   * @description Generate a new verification token and send it to an unverified user
   */
  async resendVerificationEmail(email) {
    const user = await User.findOne({ email });
    // Use a generic response for unknown email addresses
    // to avoid revealing whether an account exists.
    if (!user) {
      return {
        message:
          "If an account exists for this email, a verification email has been sent.",
      };
    }

    if (user.isEmailVerified) {
      const error = new Error("Email already verified");
      error.statusCode = 400;
      throw error;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save();

    await EmailService.sendVerificationEmail(email, verificationToken);

    return {
      message: "Verification email resent. Check your inbox.",
    };
  }

  /**
   * @name Verify Token
   * @description Verify a JWT and return its decoded payload
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * @name Bootstrap First Admin
   * @description Promote the configured first-admin email to admin after email verification
   */

  async bootstrapFirstAdmin(user) {
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL?.toLowerCase().trim();

    if (!firstAdminEmail) {
      return user;
    }

    const userEmail = user.email?.toLowerCase().trim();

    if (userEmail !== firstAdminEmail) {
      return user;
    }

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      return user;
    }

    user.role = "admin";

    await user.save();

    return user;
  }
}

module.exports = new AuthService();
