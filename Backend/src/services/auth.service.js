const crypto = require("crypto");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const EmailService = require("./email.service");

class AuthService {
  // Generate JWT token
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

  // Register new user
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

  // Login existing user
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

  // Verify email
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

    return {
      message: "Email verified successfully. You can now login.",
      user: user.toJSON(),
    };
  }

  // Resend verification email
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

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

module.exports = new AuthService();
